const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = function(env, argv) {
  let plugins = [
    new HtmlWebPackPlugin({
      template: "./index.html"
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    })
  ];

  if (env.production) {
    plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    )
  }

  return {
    context: path.join(__dirname, 'client'),
    entry: './app.jsx',
    output: {
      filename: 'app.js',
      path: path.join(__dirname, 'public'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js(x)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.htm(l)$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        },
        {
          test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)\?*.*$/,
          loader: 'file-loader'
        },
      ]
    },
    plugins,
    devtool: 'source-map',
    resolve: {
      modules: ['static', 'node_modules'],
      extensions: ['.js', '.jsx']
    },
    resolveLoader: {
      modules: [__dirname, 'node_modules']
    },
    performance: {
      hints: false
    },
    devServer: {
      contentBase: '/',
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          secure: false
        }
      }
    }
  }
};
