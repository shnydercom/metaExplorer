const webpack = require('webpack')
const path = require('path')

const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const sharedWebpackCfg = require('./webpack.shared');

module.exports = { ...sharedWebpackCfg,
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
    port: 5000,
    historyApiFallback: true,
    inline: true,
    proxy: {
      /*'/static/interpreters.json': {
        bypass: function (req, res, opt){
          res.writeHead(200, {'Content-Type': 'application/json', 'Content-Encoding': 'deflate'});
          //res.json(JSON.stringify(opt));
          return '';
        }
      },*/
      '/demo/**': { //catch all requests
        target: '/index.html', //default target
        secure: false,
        bypass: function (req, res, opt) {
          //your custom code to check for any exceptions
          //console.log('bypass check', {req: req, res:res, opt: opt});
          /**bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        } */
          if (
            (req.path.indexOf('/static/') !== -1) ||
            (req.path.indexOf('/lib/') !== -1) ||
            (req.path.indexOf('main.') !== -1) ||
            (req.path.indexOf('style.') !== -1)) {
            return req.path;
          }

          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new CleanWebpackPlugin('dist', {}),
    new webpack.ProvidePlugin({
      "React": "react",
      "Quagga": "quagga"
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      //custom props:
      //materialIconsPath: "/static/material-design-icons/iconfont/material-icons.css",
      //robotoPath: "/static/typeface-roboto/index.css", 
      //plugin props:
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new WriteFilePlugin({log: false}),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          require(path.resolve('scripts') + '/' + 'createItptMock.js');
        });
      }
    },
    new CopyWebpackPlugin([
      /*{
        from: 'node_modules/material-design-icons/iconfont',
        to: 'static/material-design-icons/iconfont'
      },
      {
        from: 'node_modules/typeface-roboto',
        to: 'static/typeface-roboto'
      },*/
      {
        from: 'assets',
        to: 'static'
      },
      {
        from: 'mocks',
        to: 'static'
      },
      {
        from: 'node_modules/react/umd/react.development.js',
        to: 'lib/react.js'
      },
      {
        from: 'node_modules/react-dom/umd/react-dom.development.js',
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
    ])
  ]
}