const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'webclient', 'views', 'App.jsx'),
  output: {
    path: path.resolve(__dirname, 'webclient', 'assets'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      loader: 'babel',
      test: /\.jsx$/,
      query: {
        presets: ['es2015', 'react', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '/index.js', '/index', '/index.jsx']
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty'
  }
};
