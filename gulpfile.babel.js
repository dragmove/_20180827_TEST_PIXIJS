// environment
const pkg = require('./package.json'),
  path = require('path'),
  dirName = path.resolve('./');

// node modules
const gulp = require('gulp'),
  gutil = require('gulp-util'),
  extend = require('extend'),
  webpack = require('webpack'),
  WebpackDevServer = require('webpack-dev-server'),
  webpackStream = require('webpack-stream');

// configs
const webpackConfig = require('./webpack.config.babel.js'),
  devConfig = webpackConfig(true, { banner: banner() }),
  prodConfig = webpackConfig(false, { banner: banner() });

function banner() {
  return `/*
 * Project : ${pkg.name} ${pkg.version}
 * Update : ${new Date().toString()}
 */
`;
}

gulp.task('build:js-prod', () => {
  gulp
    .src('')
    .pipe(webpackStream(prodConfig, webpack))
    .pipe(gulp.dest(path.resolve(dirName, 'js')));
});

// run webpack-dev-server
gulp.task('run:webpack-dev-server', function() {
  const compiler = webpack(devConfig),
    server = new WebpackDevServer(compiler, devConfig.devServer);

  server.listen(devConfig.devServer.port, 'localhost', err => {
    if (err) console.error('[webpack-dev-server failed to start :', err);
  });
});
