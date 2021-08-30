# template_2.6.12

### 基于Vue2.6.12版本配置服务端渲染并保持客户端渲染

##### 所有依赖版本固定

##### 不包含polyfill 当需求庞大到需要使用到vue时 将认为有可能不需要polyfill(如b端) 因此默认不包含 如需求是实现小页面更应该使用preact等小型框架进行开发

##### eslint 忽略 lib, vue.config.js

##### 只包含最基本的ssr改造 更多细节, 特定需求参考以下文档

##### 打包相关参考 vue-cli, webpack 官方文档

##### 编译/polyfill相关参考 babel 官方文档

##### 代码规范相关参考 eslint 官方文档

##### 服务端渲染相关参考 https://ssr.vuejs.org/

### 注意
##### 服务端渲染中生成真实node之前的代码会在服务端与客户端都执行一遍

##### 因此在挂载之前(mounted之前的生命周期中)不应该使用浏览器相关api 只能使用node相关api

##### 在服务端与客户端都执行一遍之后 客户端渲染接管服务端渲染的内容 这个过程被称为水合

##### 只有在两次执行生成的vnode保持一致的情况下 客户端才会去接管服务端渲染的内容

##### 否则客户端将不工作 导致水合失败

##### 为了保证水合成功 请确保两次执行生成的vnode保持一致

##### 如无法保证的情况 请更改你的代码, 实现一致

##### 遇到这种情况必然是在页面组件级及以下级别组件的内容不一致 在组件中一般只会有 v-if 会引起vnode不一致

##### 如遇到v-if 服务端渲染的判断结果与客户端渲染的判断结果不一致 请将其改为v-show

##### v-if 是vnode的插入删除 会影响vnode树的结构

##### v-show 仅是切换css display的值 不会影响vnode树的结构

### 扩展

##### 引入pm2来管理服务进程

##### 引入nginx来将客户端渲染服务器/服务端渲染服务器反代到同一端口上 并利用upstream实现降级容灾

### 问题1

vue-cli @vue/cli 4.5.8 搭建的项目 假设将所有依赖都是设为固定版本后运行 eslint会报
Configuration for rule "import/no-cycle" is invalid:
Value "∞" should be integer.
这是版本问题导致的
开发依赖eslint-plugin-import 从2.22.1版本开始才支持"∞" 升级版本可解决此问题 如果不升级版本就需要将其改为Infinity
参考 https://stackoverflow.com/questions/64790681/eslint-error-configuration-for-rule-import-no-cycle-is-invalid
起因应该是一开始就采用了最新依赖导致的 版本不固定转为版本固定 而导致出现版本问题

## Project setup
```
npm install
```

### 开发环境 客户端渲染
```
npm run serve
```

### 生产环境 客户端渲染
```
npm run build-ssr
```

### 生产环境 服务端渲染
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
