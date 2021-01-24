const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.js',
      '.vue'
    ],
    alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      }
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      appMountId: 'app',
      filename: 'index.html',
      template: 'src/index.html'
    })
  ]
};

module.exports = config;
