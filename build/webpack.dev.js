const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const common = require('./webpack.config.js');

const resolve = dir => path.resolve(__dirname, '..', dir);

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new ESLintPlugin({
      overrideConfigFile: resolve(".eslintrc.js"),
      context: resolve("src"),
      extensions: ['ts', 'js'],
      fix: true,
    }),
    new ProgressBarWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'x-sheet',
      scriptLoading: 'blocking',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
  output: {
    filename: 'js/[name].[contenthash].js',
    library: 'x-sheet',
    libraryTarget: 'umd',
  },
  devServer: {
    host: '127.0.0.1',
    port: 'auto',
    static: './',
    hot: true,
    bonjour: true,
    client: {
      progress: true,
      overlay: true,
    },
  },
});
