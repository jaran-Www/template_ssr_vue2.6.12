const path = require('path');
const fs = require('fs');
const Express = require('express');
const { createBundleRenderer } = require('vue-server-renderer');

function createCsrServer({ dirname }) {
  const server = Express();
  const root = path.join(dirname, '../dist-client/');
  server.use(Express.static(root, {
    etag: false,
    setHeaders: (res, p, stat) => {
      res.set('Cache-Control', 'public, max-age=3600');
    },
  }));

  server.all('*', (request, response, next) => {
    const { originalUrl } = request;
    console.log(originalUrl);
    try {
      response.end(fs.readFileSync(`${root}index.html`));
    } catch (err) {
      console.log(err);
      response.status = 400;
      response.end(err);
    }
  });

  return server;
}

function createSsrServer({ bundle, dirname }) {
  const server = Express();
  const { server: serverBundleName, client: clientBundleName } = require(bundle);
  const root = path.join(dirname, '../dist/');
  const templateURL = path.join(dirname, '../public/index-ssr.html');
  const serverBundle = require(root + serverBundleName);
  const clientManifest = require(root + clientBundleName);
  // options doc: https://ssr.vuejs.org/api/#renderer-options
  const config = {
    runInNewContext: false,
    basedir: dirname,
    clientManifest,
    shouldPreload: (file, type) => {
      return true;
    },
    shouldPrefetch: (file, type) => {
      // 忽略掉本身就会注入到html的js/css文件
      if (type === 'script' || type === 'style') {
        return file.startsWith('js/') || file.startsWith('utils/');
      }
      return true;
    },
  };
  const render = createBundleRenderer(serverBundle, { ...config, template: fs.readFileSync(templateURL, 'utf-8') });

  server.use(Express.static(root, {
    etag: false,
    setHeaders: (res, p, stat) => {
      res.set('Cache-Control', 'public, max-age=3600');
    },
  }));

  server.all('*', (request, response, next) => {
    let { baseUrl, url, originalUrl } = request;
    console.log(originalUrl);
    // 由于index.html本身不存在 是服务器动态生成的 因此需要伪造应该index.html
    // 同时由于路由被客户端接管 因此客户端路由也需要配置index.html指向根路由组件
    if (url.startsWith('/index.html')) {
      let urlSearch = url.split('?')[1] || ''
      if (urlSearch) urlSearch = `?${urlSearch}`
      url = `/${urlSearch}`
    }

    const context = { url, baseUrl, title: 'SSR', };
    try {
      response.type('.html');
      // 流式渲染
      render.renderToStream(context).pipe(response);
    } catch (err) {
      console.log(err);
      response.status = 400;
      response.end(err);
    }
  });

  return server;
}

module.exports = {
  createCsrServer,
  createSsrServer,
};
