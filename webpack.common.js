const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [path.resolve(__dirname, 'frontend')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  devtool: 'source-map',
  mode: process.env.MINDPILL_ENV === 'production' ? 'production' : 'development'
}
