const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const assets = [
  './themes/yourtheme/lib/scss/style.scss',
  './themes/yourtheme/lib/js/bundle.js'
];

const provide = new webpack.ProvidePlugin({
  $: 'cash-dom',
  jQuery: 'cash-dom'
})

module.exports = {
  entry: assets,
  output: {
    filename: './bundle.min.js',
    path: path.resolve(__dirname, './themes/yourtheme/source/assets/js')
  },
  watch: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.resolve(__dirname, "/node_modules"),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        exclude: path.resolve(__dirname, "/node_modules"),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { url: false } },
            { loader: 'postcss-loader', options: { config: { path: 'postcss.config.js' } } },
            { loader: 'sass-loader', query: { sourceMap: false } }
          ],
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '../css/style.min.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {
        from: 'themes/yourtheme/lib/robots.txt',
        to: '../../robots.txt',
      },
      {
        from: 'themes/yourtheme/lib/fonts',
        to: '../fonts',
      },
      {
        from: 'themes/yourtheme/lib/images',
        to: '../images',
      },
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 65,
          progressive: true,
        }),
        imageminPngquant({
          quality: 80,
          speed: 10,
        }),
      ],
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false,
        },
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    provide
  ],
};
