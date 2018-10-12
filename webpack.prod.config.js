const webpack = require('webpack')
const path = require('path')

//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  entry: {
    //"index": 
    //'@babel/polyfill',
    main: "./src/index"
    //"css": "./styles/styles.scss"
  },

  // configure the output directory and publicPath for the devServer
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

  // tell Webpack to load TypeScript files
  resolve: {
    // Look for modules in .ts(x) files first, then .js
    extensions: ['.json', '.css', '.scss', '.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules'],
  },

  module: {
    rules: [ // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [{
          loader: "awesome-typescript-loader",
          query: {
            useBabel: true,
            useCache: true,
            /*babelOptions: {
              babelrc: false,
              presets: [
                ["@babel/env", { "targets": "last 2 versions, ie 11", "modules": false }], '@babel/preset-react', 
                ['minify', {'mangle':false}]
              ]
            },*/
            babelCore: "@babel/core"
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              camelcase: true,
              namedExport: true,
              modules: true,
              sourceMap: true,
              importLoaders: 2,
              localIdentName: "[name]--[local]--[hash:base64:8]" // '[local]' // "[name]--[local]--[hash:base64:8]"
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }, // has separate config, see postcss.config.js nearby
        ]
      },
      /*{
        test: /\.scss$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },*/
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: true,
              importLoaders: 2,
              localIdentName: /*[name]--*/ '[local]' //--[hash:base64:8]'
            }
          },
          "postcss-loader",
          'sass-loader'
        ]
      },
     /* {
        test: /\.html$/,
        use: 'html-loader'
      },*/
      {
        test: /\.png$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.jpg$/,
        use: 'file-loader'
      }
    ]
  },
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    'quagga': {
      root: 'Quagga',
      commonjs2: 'quagga',
      commonjs: 'quagga',
      amd: 'quagga'
    }
    /*'urijs': {
      root: 'urijs',
      commonjs2: 'urijs',
      commonjs: 'urijs',
      amd: 'urijs'
    }*/
    /*,
        "lodash": {
          commonjs: 'lodash',
          commonjs2: 'lodash',
          amd: '_',
          root: '_'
        }*/
  },
  plugins: [
    new CleanWebpackPlugin('dist', {} ),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.ProvidePlugin({
      "React": "react",
      "Quagga": "quagga"
    }),
    /*new MinifyPlugin({
      mangle: false
    }),*/
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    /*new ExtractTextPlugin('style.css', {
      allChunks: true
    }),*/
    /*new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      sourceMap: false,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),*/
    //new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
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
    /* new MiniCssExtractPlugin({
       // Options similar to the same options in webpackOptions.output
       // both options are optional
       filename: "[name].css",
       chunkFilename: "[id].css"
     })*/
  ]
}