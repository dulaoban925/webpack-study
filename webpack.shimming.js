const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/shimming.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/shimming'),
    clean: true
  },
  module: {
    rules: [
      {
        test: require.resolve('./src/shimming.js'),
        /**
         * imports loader 允许使用依赖于特定全局变量的模块。对于依赖 window 对象下的全局变量（比如 $ 或 this）的第三方模块非常有用。
         * 
         * 细粒度 shimming，通过 imports-loader 覆盖 this 指向。
         * 
         * 
         * wrapper 会以给定的 thisArg 和 args关闭函数中的模块代码
         * 代码编译为以下结构：
         * (function() {
         *  ...code
         * }.call(window))
         * 
         * 若源码中存在 ESModule import，不要使用该配置
         */
        use: 'imports-loader?wrapper=window'
      }
    ]
  },
  plugins: [
    /**
     * shimming 依赖预置：
     * 
     * 使用 ProvidePlugin 后，能够在 webpack 编译的每个模块中，通过访问一个变量来获取一个 package。
     * 如果 webpack 发现模块中用到了这个变量，将在最终 bundle 中引入改定的 package。
     * 此处以 lodash 为例，让在应用中使用 _ 全局变量时，会将 lodash 打包进最终 bundle。
     */
    new webpack.ProvidePlugin({
      _: 'lodash',
      // 暴露某个模块的单独导出
      join: ['lodash', 'join']
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack Shimming Study'
    })
  ],
  devServer: {
    static: 'dist/shimming'
  }
};