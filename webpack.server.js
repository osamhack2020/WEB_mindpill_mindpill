const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  entry: './frontend/server.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ssr.js'
  },
  target: 'node'
})
