const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => {
  /**
   * 环境变量：（https://webpack.docschina.org/api/cli/#environment-options）
   * webpack cli 环境配置的 --env 参数，允许传入任意数量的环境变量。在 webpack.config.js 中可以访问。
   * 如 webpack --env production、webpack --env goal=local
   * 
   * webpack.config.js 若想获取环境变量，需要使用函数形式，参数 env 则为环境变量对象集合。
   */
  const isProduction = !!env.production
  const mode = isProduction ? 'production' : 'development'
  const sourceMap = isProduction ? 'none' : 'eval-cheap-source-map' 

  return {
    mode,
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
    entry: './src/index.js',
    output: {
      /**
       * webpack 提供一种 “可替换模板字符串”，通过带括号字符串来模板化文件名，如 [name]
       * [contenthash] 将根据资源内容创建唯一值。当资源内容发生变化时，[contenthash] 也将发生变化。
       */
      filename: '[name].[contenthash].js',
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
    devtool: sourceMap,
    /**
     * 开发服务：webpack-dev-server
     * 内部使用了 webpack-dev-middleware
     */
    devServer: {
      static: './dist',
      /**
       * 开启 HMR（热模块更新）
       * webpack-dev-server v4.0.0 开始默认开启
       */
      hot: true,
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
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all'
    //   }
    // }
  
    /**
     * 构建缓存：
     * 客户端需要访问服务器获取站点和资源，使用缓存技术，可以在文件内容不改变的情况下，直接获取缓存资源，避免重复访问服务器，耗费时间。
     * webpack 通过在 output.filename 中使用 [contenthash] 来明确文件内容是否变更
     * 然而仅仅配置 filename，仍然会导致相同文件，多次编译的 hash 值不同
     * 因为 webpack 在入口 chunk 中，包含了某些引导模板（boilerplate，指 webpack 运行时的引导代码），特别是 runtime 和 manifest。
     * 可以通过配置 optimization.runtimeChunk 将 runtime 代码拆分为单独的 chunk，将其设置为 “single” 以为所有 chunk 创建一个 runtime bundle。
     */
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        /**
         * 缓存:
         * 由于第三方依赖如 lodash、react 等，很少像本地源码一样频繁修改
         * 建议将第三方依赖提取到单独的 vendor chunk 中，以减少客户端对服务器的请求，同时保证自身代码与服务器端一致。
         * 通过 SplitChunksPlugin 插件的 cacheGroups 选项来实现。
         */
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  }
}