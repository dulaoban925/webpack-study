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

console.log(module.hot)

/**
 * 模块热更新（HMR）
 * 手动监听某个文件变更，如此处的 print.js
 * 若选择手动监听，则需要手动添加热更新逻辑
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