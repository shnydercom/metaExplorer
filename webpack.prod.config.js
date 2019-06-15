const webpack = require('webpack')

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const sharedWebpackCfg = require('./webpack.shared');

module.exports = {
  ...sharedWebpackCfg,
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.ProvidePlugin({
      "React": "react",
      "Quagga": "quagga"
    }),
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      //custom props:
      materialIconsPath: "https://fonts.googleapis.com/icon?family=Material+Icons",
      robotoPath: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700", 
      //plugin props:
      
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
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
      },
      {
        from: 'node_modules/swagger-client/browser/index.js',
        to: 'lib/swagger-client.js'
      },
      {
        from: 'node_modules/qrcode-generator/qrcode.js',
        to: 'lib/qrcode-generator@1.4.3.js'
      },
      {
        from: 'node_modules/qr-scanner/qr-scanner.min.js',
        to: 'lib/qr-scanner@1.1.1.js'
      },
      {
        from: 'node_modules/qr-scanner/qr-scanner-worker.min.js',
        to: 'lib/qr-scanner-worker.min.js@1.1.1.js'
      },
      {
        from: 'node_modules/keycloak-js/dist/keycloak.min.js',
        to: 'lib/keycloak-js@6.0.0.js'
      },
    ]),
  ]
}