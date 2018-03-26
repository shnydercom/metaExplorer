const webpack = require('webpack')
const path = require('path')

const polyfill = require('@babel/polyfill')

//const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require('write-file-webpack-plugin');

/*const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});*/

module.exports = {
  devtool: "source-map",

  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  entry: [
    //"index": 
    '@babel/polyfill', "./src/index"
    //"css": "./styles/styles.scss"
  ],

  // configure the output directory and publicPath for the devServer
  output: {
    filename: '[name].js',
    publicPath: 'dist',
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
    extensions: ['.json', '.css', '.scss','.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules'],
  },

  module: {
    /*loaders: [
       // .ts(x) files should first pass through the Typescript loader, and then through babel
       { test: /\.tsx?$/, loaders: ['babel-loader','awesome-typescript-loader'], include: path.resolve('src') },
     //  {test :/\.jsx?$/, loaders: ['babel-loader']}
    ]*/
    rules: [ // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/env',
                "@babel/preset-es2015", '@babel/preset-react'
              ]
            }
          },
          {
            loader: "awesome-typescript-loader"
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
         /* {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 2,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },*/
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              camelcase: true,
              namedExport: true,
              modules: true,
              sourceMap: true,
              importLoaders: 2,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          "postcss-loader" // has separate config, see postcss.config.js nearby
        ]
      },
      {
        test: /\.scss$/,
        use: 
        ExtractTextPlugin.extract({
          fallback: 'style-loader',

          // Could also be write as follow:
          // use: 'css-loader?modules&importLoader=2&sourceMap&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
          use: [//'style-loader',
          //MiniCssExtractPlugin.loader,
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
        }),
      },
      /*{
        test: /\.s?css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "postcss-loader",
            "sass-loader"
          ]
        })
      },*/
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.png$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.jpg$/,
        use: 'file-loader'
      },
      /*,
      {
        test: /\.css$/,
        use: [{
          loader: "css-loader"
        }]
      }*/
      /*{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }*/
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
    'urijs': {
      root: 'urijs',
      commonjs2: 'urijs',
      commonjs: 'urijs',
      amd: 'urijs'
    }
    /*,
        "lodash": {
          commonjs: 'lodash',
          commonjs2: 'lodash',
          amd: '_',
          root: '_'
        }*/
  },
  plugins: [
    new WriteFilePlugin(),
    new CopyWebpackPlugin([{
      from: 'assets',
      to: 'static'
    }]),
   /* new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })*/
    new ExtractTextPlugin('style.css', {
      allChunks: true
    })
  ]
}