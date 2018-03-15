const path = require('path');

module.exports = {
  entry: './dev/index.jsx',
  output: {
    path: path.join(__dirname, '/public/js/'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};
