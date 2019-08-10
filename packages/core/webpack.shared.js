const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // entry point of our application, within the `src` directory (which we add to resolve.modules below):
  // entry: [/*'@babel/polyfill',*/ "./src/index"],
  entry: {
    main: [/*'@babel/polyfill',*/ './src/index.ts'],
    /*vendor: [
      'babel-polyfill',
      'react',
      'react-dom'
    ]*/
  },
  // configure the output directory and publicPath for the devServer
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'metaexplorer-core',
    path: path.resolve('_bundles')
  },

  // configure the dev server to run 
  devServer: {
    port: 5000,
    historyApiFallback: true,
    inline: true,
  },

  // tell Webpack to load TypeScript files
  resolve: {
    // Look for modules in .ts(x) files first, then .js
    extensions: ['.json', '.css', '.scss', '.ts', '.tsx', '.js'],

    // add 'src' to the modules, so that when you import files you can do so with 'src' as the relative route
    modules: ['src']//, 'node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
            /*options: {
              transpileOnly: true
            }*/
          }
        ]
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(s?)css$/,
        use: [
          // fallback to style-loader in development
          // MiniCssExtractPlugin.loader,
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.png$/,
        use: 'file-loader'
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
    'react-redux': {
      root: 'ReactRedux',
      commonjs2: 'react-redux',
      commonjs: 'react-redux',
      amd: 'react-redux'
    },
    'react-router-dom': {
      root: 'ReactRouterDOM',
      commonjs2: 'react-router-dom',
      commonjs: 'react-router-dom',
      amd: 'react-router-dom'
    },
    'react-router': {
      root: 'ReactRouter',
      commonjs2: 'react-router',
      commonjs: 'react-router',
      amd: 'react-router'
    },
    'redux': {
      root: 'redux',
      commonjs2: 'redux',
      commonjs: 'redux',
      amd: 'redux'
    },
    'redux-observable': {
      root: 'reduxObservable',
      commonjs2: 'redux-observable',
      commonjs: 'redux-observable',
      amd: 'redux-observable'
    },
    'shortid': {
      root: 'shortid',
      commonjs2: 'shortid',
      commonjs: 'shortid',
      amd: 'shortid'
    },
    'rxjs': {
      root: 'rxjs',
      commonjs2: 'rxjs',
      commonjs: 'rxjs',
      amd: 'rxjs'
    },
    'rxjs/operators': {
      root: 'rxjsOperators',
      commonjs2: 'rxjs/operators',
      commonjs: 'rxjs/operators',
      amd: 'rxjs/operators'
    },
  },
  plugins: [
    //new ForkTsCheckerWebpackPlugin({ workers: 1 , memoryLimit: 4098*2})
  ]
}
