const Path = require('path')
modules.exports = {
  entry: './src/index',
  output: './dist/test.js',
  mode: 'development',
  module: {
    rules: [

    ]
  },
  plugins: [
    new HtmlwebpackPlugin({
      template: './test/index.html'
    }),
  ],
  devServer: {
    contentBase: './dist',	// 服务的基础目录
    hot: true
  }

}