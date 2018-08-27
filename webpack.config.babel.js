const path = require('path'),
  dirName = path.resolve('./'),
  webpack = require('webpack'),
  UglifyJsPlugin = require('uglifyjs-webpack-plugin');

function createConfig(isDebug, options = { outputPath: '', banner: '' }) {
  let devTool = '',
    plugins = [];

  const appEntry = {
      index: ['./_src/js/index.js'],
      smoke: ['./_src/js/smoke.js']
    },
    externals = {
      jquery: 'jQuery'
    };

  if (isDebug) {
    // develop env
    devTool = 'eval-source-map';

    // https://www.npmjs.com/package/uglifyjs-webpack-plugin
    plugins.push(
      new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          warnings: true,
          compress: {
            drop_console: false,
            unused: false,
            warnings: true
          },
          mangle: false,
          output: {
            beautify: true,
            comments: true
          }
        }
      }),
      new webpack.BannerPlugin({
        banner: options.banner || '',
        raw: true
      })
      // new webpack.HotModuleReplacementPlugin()
    );
  } else {
    // production env
    devTool = 'source-map';

    plugins.push(
      new UglifyJsPlugin({
        sourceMap: false,
        uglifyOptions: {
          warnings: true,
          compress: {
            drop_console: true,
            unused: true,
            warnings: true
          },
          mangle: true,
          output: {
            beautify: false,
            comments: false
          }
        }
      }),
      new webpack.BannerPlugin({
        banner: options.banner || '',
        raw: true
      })
    );
  }

  const outputPath = options.outputPath
    ? path.resolve(dirName, options.outputPath)
    : path.resolve(dirName, 'js');

  return {
    target: 'web',

    entry: appEntry,

    externals: externals,

    output: {
      path: outputPath,
      filename: '[name].js'
    },

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },

        {
          test: /\.jsx?$/,
          exclude: [/node_modules/, /vendor/],
          loader: 'eslint-loader'
        }
      ]
    },

    // https://webpack.js.org/configuration/devtool/
    devtool: devTool,

    plugins: plugins,

    devServer: {
      contentBase: './',
      noInfo: true,
      host: '',
      port: 9001,
      hot: true,
      inline: true
    }
  };
}

module.exports = createConfig;
