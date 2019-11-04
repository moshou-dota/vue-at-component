const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

function resolve(src) {
  return path.join(__dirname, src)
}

module.exports = {
  entry: resolve('test'),
  output: {
    path: resolve('dist'),
    filename: '[name].js'
  },
  mode: 'development',
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new OptimizeCSSPlugin({
      cssProcessor: require('cssnano'), //引入cssnano配置压缩选项
      assetNameRegExp: /\.css$/g,
    }),
    new HtmlWebpackPlugin({
      template: resolve('test/index.html'),
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: resolve('dist'),
    hot: true
  },
  devtool: 'source-map'
}