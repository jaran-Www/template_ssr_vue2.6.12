const path = require('path');
const nodeExternals = require('webpack-node-externals');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueServerPlugin = require('vue-server-renderer/server-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isNode = process.env.TARGET === 'node';
const isClient = process.env.RENDER === 'client';
const { server, client } = require('./lib/bundle.json');

// 以下配置皆可从vue-cli webpack4中查得到 如有自定义需求 请自行查阅官方文档

// csr build 与 ssr build 打包输出到不同的目录
// csr 将作为 ssr 的后备内容 可用于降级容灾
const renderMap = {
  client: {
    outputDir: 'dist-client',
  },
  server: {
    outputDir: 'dist',
  },
};

// ssr build时 会同时进行两次打包
// 一次生成服务端所需内容(生成依赖分析文件) 一次生成客户端所需内容(生成资源文件)
// 在生成客户端所需内容时 不再需要生成html文件 故有以下配置
// 如需了解或有自定义配置的需求 请参考vue-cli官方文档 https://cli.vuejs.org/zh/guide/html-and-static-assets.html#%E4%B8%8D%E7%94%9F%E6%88%90-index
function ssrClient(config) {
  config.plugins.delete('html');
  config.plugins.delete('preload');
  config.plugins.delete('prefetch');
}

// 指定模板文件
function csrClient(config) {
  config
    .plugin('html')
    .tap(args => {
      args[0].template = './public/index-csr.html';
      return args;
    });
}

const common = {
  publicPath: '/',
  productionSourceMap: process.env.ENVIRONMENT !== 'prod',
  lintOnSave: process.env.ENVIRONMENT !== 'prod',
  css: {
    extract: false,
  },
  chainWebpack: config => {
    isClient ? csrClient(config) : ssrClient(config);
  },
};

const serverConfigureWebpack = {
  entry: resolve('./src/main-ssr.js'),
  devtool: 'source-map',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals(),
  plugins: [new VueServerPlugin({ filename: server })],
  optimization: {
    splitChunks: false,
  },
};

const plugins = [];
isClient || plugins.push(
  new VueSSRClientPlugin({ filename: client }),
);

const clientConfigureWebpack = {
  entry: resolve('./src/main-csr.js'),
  devtool: 'source-map',
  node: false,
  plugins,
  optimization: {
    // 拆分第三方包
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vue: {
          name: 'vue',
          test: /[\\/]node_modules[\\/]vue/,
          priority: 30,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
      },
    },
  },
};

common.configureWebpack = isNode ? serverConfigureWebpack : clientConfigureWebpack;

module.exports = { ...common, ...renderMap[process.env.RENDER], };
