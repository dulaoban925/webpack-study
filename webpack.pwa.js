const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/pwa'),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack PWA Study'
    }),
    // WorkboxWebpackPlugin 插件创建 Service Worker。
    // 编译生成一个 service-worker.js 和 service-worker.js 引用的文件。
    // 逻辑中可以使用 navigator.serviceWorker.register 注册 Service Worker。
    new WorkboxWebpackPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    })
  ]
})