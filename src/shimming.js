function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  // element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.innerHTML = join(['Hello', 'webpack'], ' ');

  // 假设此处为某些遗留模块，this 指向 window 对象。
  // 但是当模块运行在 commonjs 上下文中时，会出现问题，因为此时 this 指向的是 module.exports。
  // 为保障正确运行，需要使用 细粒度 shimming。见 webpack.shimming.js module.rules
  this.alert('Hmmm, this probably isn\'t a great idea...')

  return element;
}

document.body.appendChild(component());