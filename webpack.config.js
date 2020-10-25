const path = require('path')
const { merge } = require('webpack-merge')

const common = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['cache-loader', 'babel-loader'],
        include: [path.resolve(__dirname, 'frontend')]
      }
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  devtool: 'source-map',
  mode: process.env.MINDPILL_ENV === 'production' ? 'production' : 'development'
}

module.exports = [
  merge(common, {
    entry: './frontend/browser.tsx',
    output: {
      path: path.resolve(__dirname, 'dist/frontend'),
      filename: 'bundle.js'
    }
  }),
  merge(common, {
    entry: './frontend/server.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'ssr.js'
    },
    target: 'node'
  })
]
