const path = require('path');
const { merge } = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarWebpackPlugin = require('progress-bar-webpack-plugin');
const common = require('./webpack.config.js');

const resolve = dir => path.resolve(__dirname, '..', dir);

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      overrideConfigFile: resolve(".eslintrc.js"),
      context: resolve("src"),
      extensions: ['ts', 'js'],
      fix: true,
    }),
    new ProgressBarWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'x-draw-core',
      scriptLoading: 'blocking',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  output: {
    filename: 'js/[name].js',
    libraryTarget: 'umd',
    library: 'x-sheet',
    path: resolve('dist'),
  },
});
