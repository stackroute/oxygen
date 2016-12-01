const gulp = require('gulp');
// const gutil = require('gulp-util');

const usemin = require('gulp-usemin');
const minifyHtml = require('gulp-minify-html');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');
const minifyCss = require('gulp-minify-css');
const clean = require('gulp-clean');
const flatten = require('gulp-flatten');

const eslint = require('gulp-eslint');
const htmlhint = require('gulp-htmlhint');

const gulpWebpack = require('gulp-webpack');

const mocha = require('gulp-mocha');

gulp.task('webpack', ['clean'], function() {
  const config = require('./webpack.config.js');
  return gulp.src('./webclient/App.jsx')
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest('./webclient/assets'));
});

gulp.task('usemin', ['clean', 'webpack'], function() {
  return gulp.src(['webclient/*.html'])
    .pipe(usemin({
      html: [minifyHtml({
        empty: true
      })],
      js: [uglify(), rev()],
      inlinejs: [uglify()],
      css: [rev()],
      inlinecss: [minifyCss()]
    })).pipe(gulp.dest('dist/server/public'));
});

gulp.task('copy:fonts', ['clean'], function() {
  return gulp.src('webclient/**/*.ttf')
    .pipe(flatten())
    .pipe(gulp.dest('dist/server/public/fonts'));
});

gulp.task('copy:package.json', ['clean'], function() {
  return gulp.src('package.json')
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy:server', ['clean'], function() {
  gulp.src(['server/**/*'])
    .pipe(gulp.dest('dist/server/'));
});

gulp.task('clean', function() {
  return gulp.src('dist', {
      read: false
    })
    .pipe(clean());
});

gulp.task('eslint', function() {
  return gulp.src([
      'gulpfile.js', 'webpack.config.js', '.eslintrc.js', 'server/**/*',
      'webclient/**/*.jsx', '!dist/**/*'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('htmlhint', function() {
  return gulp.src(['webclient/**/*.html', '!node_modules/**/*',
      '!bower_components/**/*', '!dist/**/*'
    ])
    .pipe(htmlhint({
      htmlhintrc: '.htmlhintrc'
    }))
    .pipe(htmlhint.failReporter());
});

gulp.task('test', function() {
  return gulp.src(['server/**/*.spec.js', '!node_modules/**/*',
      '!bower_components/**/*'
    ], {
      read: false
    })
    .pipe(mocha());
});

gulp.task('copy', ['copy:package.json', 'copy:server', 'copy:fonts']);

gulp.task('build', ['eslint', 'usemin', 'copy']);

gulp.task('lint', ['eslint', 'htmlhint']);

gulp.task('default', ['build']);
