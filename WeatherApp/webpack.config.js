const path = require('path');

module.exports = {
  context: __dirname + "/app",

  entry: {
    javascript: "./js/app.js",
    html: "./index.html",
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
    chunkFilename: '[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
    // root: path.resolve(__dirname, './app/js')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ["react-hot-loader", "babel-loader"],
      },
      {
        test: /\.html$/,
        loader: "file-loader?name=[name].[ext]",
      },
      { test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192',
       }
    ]
  }
};
