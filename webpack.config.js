const webpack = require('webpack')
const path = require('path')

const polyfill = require('@babel/polyfill')

const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const sharedWebpackCfg = require('./webpack.shared');

/*const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});*/

module.exports = {...sharedWebpackCfg,
  mode: 'development',
  devtool: "source-map",

  output: {
    filename: '[name].[chunkhash].js',
    path: 'dist',
    libraryTarget: 'umd',
    path: path.resolve('dist')
  },
  // configure the dev server to run 
  devServer: {
    port: 3000,
    historyApiFallback: true,
    inline: true,
  },
  plugins: [
    //new CleanWebpackPlugin('dist', {} ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.ProvidePlugin({
      "React": "react",
      "Quagga": "quagga"
    }),
    //new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    /*new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),*/
    new WriteFilePlugin(),
    new CopyWebpackPlugin([{
        from: 'assets',
        to: 'static'
      },
      {
        from: 'node_modules/react/umd/react.production.min.js',
        to: 'lib/react.js'
      },
      {
        from: 'node_modules/react-dom/umd/react-dom.production.min.js',
        to: 'lib/react-dom.js'
      },
      {
        from: 'node_modules/quagga/dist/quagga.min.js',
        to: 'lib/quagga.js'
      }]),
  ]
}
