var gulp = require('gulp');
var vinyl = require('vinyl');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var path = require('path');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var through2 = require('through2');
var less = require('gulp-less');
var watch = require('gulp-watch');
var minifyCSS = require('gulp-minify-css');
var jade = require('gulp-jade');

var less_src = './app/assets/styles/**/*.less';


gulp.task('server', () => {
  return nodemon({
    script: './app.js',
    ext: 'js json',
    ignore: ['assets/**/*.js', 'templates/**/*.jade'],
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('watch_styles', () => {
  return gulp.watch(less_src, ['styles'])
});

gulp.task('watch_scripts', () => {
  return gulp.watch('./app/assets/scripts/**/*.js', ['scripts'])
});

gulp.task('watch_templates', () => {
  return gulp.watch('./app/assets/templates/**/*.jade', ['templates', 'scripts'])
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

  var browserify_opts = {
    debug: true,
    transform: ['partialify', 'browserify-shim']
  };

  return gulp.src('./app/assets/scripts/main.js')
    .pipe(through2.obj((file, enc, next) => {
      browserify(browserify_opts)
        .transform('babelify', {presets: ["es2015"]})
        .require(file.path, { entry: true })
        .bundle((err, res) => {
          if (err) throw err;
          next(null, new vinyl({
            contents: res,
            path: 'bundle.js'
          }));
        });
    }))
    .pipe(buffer())
    .pipe(gulpif(!is_production(), sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(is_production(), uglify()))
    .on('error', gutil.log)
    .pipe(gulpif(!is_production(), sourcemaps.write('./')))
    .pipe(gulp.dest('./app/assets/public/'));
});

gulp.task('templates', () => {
  var YOUR_LOCALS = {};

  gulp.src('./app/assets/templates/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('./app/assets/scripts/templates/'))
});

function is_production () {
  return process.env.NODE_ENV && process.env.NODE_ENV == 'production';
}

gulp.task('compile_assets', ['templates', 'scripts', 'styles']);
gulp.task('up', ['server', 'compile_assets', 'watch_styles', 'watch_templates', 'watch_scripts']);
