const { resolve } = require('path');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: resolve(__dirname, '/build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
