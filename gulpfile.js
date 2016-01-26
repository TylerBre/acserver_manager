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
    ignore: ['assets/**/*.js', 'templates/**/*.jade'],
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('watch_styles', () => {
  return gulp.watch(less_src, ['styles'])
});

gulp.task('watch_scripts', () => {
  return gulp.watch('./app/assets/scripts/**/*', ['scripts'])
});

gulp.task('watch_templates', () => {
  return gulp.watch('./app/views/templates/**/*.jade', ['templates', 'scripts'])
});

gulp.task('styles', () => {
  return gulp.src('./app/assets/styles/style.less')
    .pipe(less())
    .pipe(minifyCSS({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest('./app/assets/public'));
});

gulp.task('scripts', () => {
  gulp.src('./app/assets/scripts/main.js')
    .pipe(browserify({
      transform: ["partialify", "browserify-shim"],
      debug: !gulp.env.production
    }))
    .pipe(gulp.dest('./app/assets/public'));
})

gulp.task('templates', () => {
  var YOUR_LOCALS = {};

  gulp.src('./app/views/templates/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/assets/templates/'))
});

// gulp.task('scripts', () => {

// });
gulp.task('compile_assets', ['templates', 'scripts', 'styles']);
gulp.task('up', ['server', 'compile_assets', 'watch_styles', 'watch_templates', 'watch_scripts']);
