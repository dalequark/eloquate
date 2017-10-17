module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: './dist/bundle.js'
  },
  devtool: './dist/source-map',
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
