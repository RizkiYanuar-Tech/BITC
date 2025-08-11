const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      // Polyfills for Node.js core modules that might be required by npm packages
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      // "os": require.resolve("os-browserify/browser"),
      "assert": require.resolve("assert/"),
      "util": require.resolve("util/"),
      // "timers": require.resolve("timers-browserify"), // Added timers polyfill
      "process": require.resolve("process/browser"), // Added process polyfill
      "net": false, // 'net' is not typically used in front-end applications
      "fs": false,  // 'fs' is not used in the browser, so we disable it
      "tls": false, // 'tls' is not available in browsers
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'sewa.html',
      template: path.resolve(__dirname, 'src/templates/sewa.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'details.html',
      template: path.resolve(__dirname, 'src/templates/details.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'callcenter.html',
      template: path.resolve(__dirname, 'src/templates/callcenter.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'contact-section.html',
      template: path.resolve(__dirname, 'src/templates/contact-section.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'complaints.html',
      template: path.resolve(__dirname, 'src/templates/complaints.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'bookingVoffice.html',
      template: path.resolve(__dirname, 'src/templates/bookingVoffice.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'paketnormal.html',
      template: path.resolve(__dirname, 'src/templates/paketnormal.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'paketkedua.html',
      template: path.resolve(__dirname, 'src/templates/paketkedua.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'paketketiga.html',
      template: path.resolve(__dirname, 'src/templates/paketketiga.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'paketkeempat.html',
      template: path.resolve(__dirname, 'src/templates/paketkeempat.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'ruangrapat.html',
      template: path.resolve(__dirname, 'src/templates/ruangrapat.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'formrapat.html',
      template: path.resolve(__dirname, 'src/templates/formrapat.html'),
      chunks: ['app'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/'),
          to: path.resolve(__dirname, 'dist/'),
        },
      ],
    }),
  ],
};
