const gulp = require('gulp');

const eslint = require('gulp-eslint');
const htmlhint = require('gulp-htmlhint');
const mocha = require('gulp-mocha');

gulp.task('lint', ['eslint', 'htmlhint']);

gulp.task('eslint', function() {
  return gulp.src(['server/**/*.js', 'webclient/**/*.jsx',
      '!node_modules/**/*', '!bower_components/**/*'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('htmlhint', function() {
  return gulp.src(['webclient/**/*.html', '!node_modules/**/*',
      '!bower_components/**/*'
    ])
    .pipe(htmlhint({
      htmlhintrc: ".htmlhintrc"
    }))
    .pipe(htmlhint.failReporter());
});

gulp.task('test', function() {
  return gulp.src(['server/**/*.spec.js', '!node_modules/**/*',
      '!bower_components/**/*'
    ], {
      read: false
    })
    .pipe(mocha())
});
