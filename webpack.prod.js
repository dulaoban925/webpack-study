const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  // 避免在生产环境使用 inline-* 或 eval-* 相关 SourceMap，因为会增加 bundle 体积
  devtool: 'source-map',
});