import _ from 'lodash'
import './style/style.css'
import print from './print'

function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['hello', 'webpack'], ' ');
  element.classList.add('hello');

  const button = document.createElement('button')
  button.innerHTML = 'Click me and check the console!'
  button.onclick = print

  element.appendChild(button)
  
  return element;
}

document.body.appendChild(component());