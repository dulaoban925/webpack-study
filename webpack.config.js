const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  /**
   * 代码分离方式1：入口起点手动分离
   * 缺点：
   *  1.不够灵活，不能动态拆分应用程序逻辑中的核心代码
   *  2.入口 chunk 中包含重复模块，这些重复模块都会被引入到各个 bundle 中。通过如下 dependOn 配置可解决。
   */
  // entry: {
  //   index: {
  //     import: './src/index.js',
  //     dependOn: 'shared'
  //   },
  //   print: './src/print.js',
  //   another: {
  //     import: './src/another-module.js',
  //     dependOn: 'shared'
  //   },
  //   // 多个入口 chunk 复用模块，可提取出来，防止引入到各个 bundle 中
  //   shared: 'lodash'
  // },
  entry: {
    index: './src/index.js',
    print: './src/print.js',
    another: './src/another-module.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // 每次编译前清空输出文件夹（/dist）
    clean: true,
    // server.js 脚本中使用，以确保文件资源能够正确的 serve 在 http://localhost:3000（express 服务定义的端口） 下
    publicPath: '/'
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
        type: 'asset/resource'
      }
    ]
  },
  /**
   * 启用 SourceMap，默认 'eval'
   * 开发环境建议使用：'inline-source-map', 'eval-source-map'
   * 生产环境建议使用：'none', 'hidden-source-map'
   */
  devtool: 'inline-source-map',
  /**
   * 开发服务：webpack-dev-server
   * 内部使用了 webpack-dev-middleware
   */
  devServer: {
    static: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'WEBPACK STUDY'
    })
  ],
  /**
   * 代码分离方式2：SplitChunkPlugin
   * 将公共依赖提取到已有的入口 chunk 中，或提取到一个新生成的 chunk
   * 
   * 代码分离方式3：动态导入（import(推荐) or require.ensure）
   * 例如导入 lodash：
   * 逻辑代码中不使用 import _ from 'lodash' 静态导入
   * 改为 
   * import('lodash').then(({default: _}) => {
   *  console.log(_.join(['Hello', 'webpack'], ' '))
   * })
   */
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}