const webpack = require('webpack')
const path = require('path')

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  devtool: "source-map",

  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  entry: "./src/index.tsx",

  // configure the output directory and publicPath for the devServer
  output: {
    filename: 'app.js',
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
    extensions: ['.ts', '.tsx', '.js','.json'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src', 'node_modules'],
  },

  module: {
   /*loaders: [
      // .ts(x) files should first pass through the Typescript loader, and then through babel
      { test: /\.tsx?$/, loaders: ['babel-loader','awesome-typescript-loader'], include: path.resolve('src') },
    //  {test :/\.jsx?$/, loaders: ['babel-loader']}
   ]*/
    rules: [// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { 
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loaders: ['babel-loader',"awesome-typescript-loader"]},
      {
        test: /\.scss$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "sass-loader",
            options: {
                includePaths: ["src/styles"]
            }
        }
      ]
    }
      /*{
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }*/
      ]
  }
  ,
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
    }/*,
    "lodash": {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: '_',
      root: '_'
    }*/
  },
  plugins: [
    new ExtractTextPlugin('public/style.css', {
        allChunks: true
    })
]
}