var gulp = require('gulp');
var path = require('path');
var nodemon = require('gulp-nodemon');
var browserify = require('gulp-browserify2');
var less = require('gulp-less');
var watch = require('gulp-watch');
var minifyCSS = require('gulp-minify-css');
var jade = require('gulp-jade');

var less_src = './app/assets/styles/**/*.less';

gulp.task('server', () => {
  return nodemon({
    script: './app.js',
    ext: 'js json jade',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('watch_styles', () => {
  return gulp.watch(less_src, ['styles'])
});

gulp.task('styles', () => {
  return gulp.src('./app/assets/styles/style.less')
    .pipe(less())
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./app/assets/public'));
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./app/views/templates/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/assets/public/templates/'))
});

// gulp.task('scripts', () => {

// });

gulp.task('up', ['server', 'watch_styles']);
gulp.task('local', ['watch_styles']);
