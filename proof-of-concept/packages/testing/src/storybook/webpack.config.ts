const path = require('path');
export function createWebpackConfig(dir: string) {
  return {
    module: {
      rules: [{
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(dir, '../')
      },
      {
        test: /\.css/,
        loaders: ["style-loader", "css-loader"],
        include: path.resolve(dir, '../')
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [
          /node_modules\//
        ]
      },
      {
        test: /\.tsx?$|\.jsx?|\.json$/,
        include: path.resolve(dir, '../src'),
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        loader: "file-loader"
      }
      ]
    },
    resolve: {
      extensions: ['.json', '.css', '.scss', '.ts', '.tsx', '.js']
    }
  }
}