const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const resolve = (url) => path.resolve(__dirname, "..", url);

module.exports = {
  entry: {
    'x-sheet': resolve("src/index.js"),
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              outputPath: 'img',
              limit: false,
              name: '[name].[ext]?[hash]',
              esModule: false,
            },
          },
        ],
        type:"javascript/auto",
      },
      {
        test: /\.(mp3|wav)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'audio',
              esModule: false,
            },
          },
        ],
        type:"javascript/auto",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'font',
              esModule: false,
            },
          },
        ],
        type:"javascript/auto",
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src'),
    },
  },
  experiments: {
    syncWebAssembly: true,
    asyncWebAssembly: true,
    topLevelAwait: true,
  }
};
