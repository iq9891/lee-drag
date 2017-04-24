var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

var webpackConfig = merge(baseWebpackConfig, {
  module: {

  },
  devtool: false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('drag.min.js'),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
  ]
})

module.exports = webpackConfig
