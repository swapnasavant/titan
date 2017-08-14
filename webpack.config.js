var webpack = require('webpack');
var ignore = new webpack.IgnorePlugin(/\.svg$/)

module.exports = {
  devtool: 'source-map',
  entry: {
    main: [
      './src/main.js',
      'webpack-dev-server/client?http://localhost:7000',
      'webpack/hot/only-dev-server'
    ]
  },
  output: {
    publicPath: 'http://localhost:7000/',
    filename: '/js/[name].js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel?' + JSON.stringify({presets: ['react', 'es2015', 'stage-0']})], exclude: /node_modules/ },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      { test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=./images/[name].[ext]' }
    ]
  },
  plugins: [ignore],
  devServer: {
  host: '0.0.0.0',
  port: '7000',
},
};
