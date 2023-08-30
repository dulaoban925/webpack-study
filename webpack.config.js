const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  /**
   * loader 可以链式调用，每个 loader 都会对资源进行转换，逆序执行，use 配置中后执行的 loader 在前面；
   * 链中的最后一个 loader 返回 javascript
   */
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|svg|png|jpeg|gif)/i,
        /**
         * webpack5 内置的资源模块(https://webpack.docschina.org/guides/asset-modules/)，允许使用资源文件（如字体、图标等）而无需配置额外的 loader。
         * 通过 4 中新的模块类型，来替换对应的 loader：
         * 1.asset/resource: 发送一个单独的文件到输出目录（dist）或自定义目录（通过 output.assetModuleFilename 或 rule.generator.filename），并导出 URL。之前通过 file-loader 实现。
         * 2.asset/inline: 导出一个资源的 data URI（默认 base64 算法编码文件内容，可通过 rule.generator.dataUrl 自定义编码算法）。之前通过 url-loader 实现。
         * 3.asset/source: 导出资源的源代码，文件内容原样注入到 bundle 中。之前通过 raw-loader 实现。
         * 4.asset: 在导出一个 data URI 和发送一个单独文件之间自动选择。之前通过 url-loader，并配置资源体积限制实现。
         */
        use: 'asset/resource'
      }
    ]
  }
}