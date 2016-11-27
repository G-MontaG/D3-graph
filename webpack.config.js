'use strict';
const path = require('path');
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const {HotModuleReplacementPlugin, LoaderOptionsPlugin} = require('webpack');

module.exports = {
  cache: true,
  watch: true,
  profile: false,

  devtool: 'source-map',
  context: path.join(__dirname, "src"),
  entry: {
    main: "./graph.ts",
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
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({fallbackLoader: 'style', loader: ['css']})
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract({fallbackLoader: 'style', loader: ['css?sourceMap&importLoaders=2!postcss!sass?sourceMap']})
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
    new ExtractTextPlugin({
      filename: "[name].css",
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      favicon: 'favicon.ico'
    }),
    new CleanWebpackPlugin(['./public']),
    new TsConfigPathsPlugin(/* { tsconfig, compiler } */),
    new HotModuleReplacementPlugin(),
    new LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({browsers: ['last 3 version']})
        ],
      },
    })
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