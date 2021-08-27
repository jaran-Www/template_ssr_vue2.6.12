import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';

Vue.config.productionTip = false;

// 客户端渲染服务端渲染共用内容在此文件中引用/设置

export function createApp() {
  const [router, store] = [createRouter(), createStore()];
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });
  return { app, router, store };
}

export default createApp();
