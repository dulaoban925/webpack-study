import _ from 'lodash'
import './style/style.css'
import print from './print'

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['hello', 'webpack'], ' ');
  element.classList.add('hello');

  const button = document.createElement('button')
  button.innerHTML = 'Click me and check the console'
  button.onclick = print

  element.appendChild(button)
  
  return element;
}

let element = component(); // 存储 element，以在 print.js 修改时重新渲染
document.body.appendChild(element);

/**
 * 模块热更新（HMR）
 * 手动监听某个文件变更，如此处的 print.js
 * 若选择手动监听，则需要手动添加热更新逻辑
 * 
 * ESM 情况下使用使用 import.meta.webpackHot 代替 module.hot。
 */
if (module.hot) {
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated print module!');
    
    // 若没有一下 element 更新逻辑，修改 print.js 的内容不会热更新到旧的 dom 节点
    // 比如 修改 print.js 打印内容后，点击 button 不会打印最新的内容
    document.body.removeChild(element);
    element = component();
    document.body.appendChild(element);
  })
}

/**
 * 渐进式网络应用程序：
 * 使用 navigator.serviceWorker 注册 ServiceWorker。
 * 
 * 执行 npm run build:pwa 编译项目，在 dist/pwa 下输出结果。
 * 执行 npm run start:pwa 运行项目，打开浏览器页面加载完成后，会执行以下程序注册 Service Worker。
 * 停止 server，刷新浏览器，项目仍可正常运行。
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}