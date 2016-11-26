'use strict';
const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const {HotModuleReplacementPlugin} = require('webpack');

module.exports = {
  cache: true,
  watch: true,
  profile: false,

  devtool: 'source-map',
  context: path.join(__dirname, "src"),
  entry: {
    main: "./main.ts",
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: '[id].chunk.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.join(__dirname, "node_modules")],
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.json$/,
        loader: 'json?name=data/[name].[ext]'
      },
      {
        test: /index\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: path.join(__dirname, "src", "index.html")
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      favicon: 'favicon.ico'
    }),
    new CleanWebpackPlugin(['./public']),
    new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
    new HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 3300,
    host: 'localhost',
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    outputPath: path.join(__dirname, "public"),
    compress: true,
    contentBase: './src',
    hot: true,
    inline: true
  },
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};