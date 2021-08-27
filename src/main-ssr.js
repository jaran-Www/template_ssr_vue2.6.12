import { createApp } from './main';

// 仅在客户端才会使用的功能应在此文件中引入
console.log(typeof window); // undefined

export default context => new Promise((resolve, reject) => {
  const { app, router } = createApp();
  router.push(context.url);
  router.onReady(() => {
    router.getMatchedComponents();
    resolve(app);
  }, reject);
});
