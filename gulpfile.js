var fs = require('fs');
var config = require('config');
var gulp = require('gulp');
var vinyl = require('vinyl');
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
var minifyCSS = require('gulp-cssnano');
var jade = require('gulp-jade');
var mocha = require('gulp-mocha');
var _ = require('lodash');
var exit = require('gulp-exit');
var app = require('./app');

var less_src = './app/assets/styles/**/*.less';


gulp.task('test', () => {
  return gulp.src('./spec/**/*.js', {read: false})
    .pipe(mocha({reporter: 'progress'}));
});

gulp.task('seed', () => {
  return app.models.sequelize.sync().then(() => {
    return app.controllers.content.update_all();
  }).then(() => exit());
});

gulp.task('server', () => {
  return nodemon({
    script: './server.js',
    ext: 'js json',
    ignore: [
      'app/assets/*',
      'node_modules/*',
      'seed/*',
      'tmp/*',
      'lib/*'
    ]
  });
});

gulp.task('watch_styles', () => {
  return gulp.watch(less_src, ['styles']);
});

gulp.task('watch_scripts', () => {
  return gulp.watch('./app/assets/scripts/**/*.js', ['templates', 'scripts']);
});

gulp.task('watch_templates', () => {
  return gulp.watch('./app/assets/templates/*', ['templates', 'scripts']);
});

gulp.task('styles', () => {
  return gulp.src('./app/assets/styles/style.less')
    .pipe(less())
    .pipe(minifyCSS({discardComments: {removeAll: true}}))
    .pipe(gulp.dest('./app/assets/public'));
});

gulp.task('create-config', (cb) => {
  fs.writeFile(path.join(__dirname, './app/assets/scripts/config.json'), JSON.stringify({
    host: config.get('app.host'),
    port: config.get('app.port')
  }, null, 2), cb);
});

gulp.task('browserify', () => {

  var browserify_opts = {
    debug: true,
    transform: ['partialify', 'brfs', 'browserify-shim']
  };

  return gulp.src('./app/assets/scripts/main.js')
    .pipe(through2.obj((file, enc, next) => {
      browserify(browserify_opts)
        .transform("babelify", {
          presets: ["es2015"],
        })
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
  var validations = JSON.parse(fs.readFileSync(path.join(__dirname, './config/validations.json')));
  gulp.src('./app/assets/templates/**/*.jade')
    .pipe(jade({data: { _, validations }}))
    .pipe(gulp.dest('./app/assets/scripts/templates/'));
});

function is_production () {
  return process.env.NODE_ENV && process.env.NODE_ENV == 'production';
}

gulp.task('scripts', ['create-config', 'browserify']);
gulp.task('compile_assets', ['templates', 'scripts', 'styles']);
gulp.task('up', ['server', 'compile_assets', 'watch_styles', 'watch_templates', 'watch_scripts']);
