import { createApp } from './main';

// 仅在客户端才会使用的功能应在此文件中引入/设置
console.log(typeof window); // object

const { app, router } = createApp();
router.onReady(() => app.$mount('#app'));
