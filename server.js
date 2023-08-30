const express = require('express')
const webpack = require('webpack')
const WebpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const complier = webpack(config)

/**
 * 告知 express 使用 WebpackDevMiddleware 插件
 * 以及将 webpack.config.js 配置文件作为基础配置
 */
app.use(
  WebpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
  })
)

app.listen(3000, function() {
  console.log('Development server listening on port 3000')
})