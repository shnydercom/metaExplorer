const path = require('path')

//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
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
            useCache: false,
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
}