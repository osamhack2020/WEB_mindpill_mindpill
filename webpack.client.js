const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  entry: './frontend/browser.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/frontend'),
    filename: 'bundle.js'
  }
})
