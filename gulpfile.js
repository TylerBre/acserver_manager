const fs = require('fs');
const config = require('config');
const gulp = require('gulp');
const vinyl = require('vinyl');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');
const path = require('path');
const nodemon = require('gulp-nodemon');
const browserify = require('browserify');
const through2 = require('through2');
const less = require('gulp-less');
const watch = require('gulp-watch');
const minifyCSS = require('gulp-cssnano');
const jade = require('gulp-jade');
const mocha = require('gulp-mocha');
const _ = require('lodash');
const exit = require('gulp-exit');
const app = require('./app');

const sequence = require('run-sequence').use(gulp);

const less_src = './app/assets/styles/**/*.less';


gulp.task('test', () => {
  return gulp.src('./spec/**/*.js', {read: false})
    .pipe(mocha({reporter: 'progress'}));
});

gulp.task('seed', () => {
  gutil.log('This is going to take about a minute, so grab a coffee...');
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

gulp.task('watch_styles', () =>
  gulp.watch(less_src, ['styles']));

gulp.task('watch_scripts', () =>
  gulp.watch('./app/assets/scripts/**/*.js', ['templates', 'scripts']));

gulp.task('watch_templates', () =>
  gulp.watch('./app/assets/templates/**/*.jade', ['templates', 'scripts']));

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
  var validations = JSON.parse(fs.readFileSync(path.resolve('./config/validations.json')));
  gulp.src('./app/assets/templates/**/*.jade')
    .pipe(jade({data: { _, validations }}))
    .pipe(gulp.dest('./app/assets/scripts/templates/'));
});

function is_production () {
  return process.env.NODE_ENV && process.env.NODE_ENV == 'production';
}

gulp.task('scripts', ['create-config', 'browserify']);
gulp.task('compile_assets', done => sequence(
  'templates',
  ['scripts', 'styles'],
  done)
);
gulp.task('watch', ['watch_styles', 'watch_templates', 'watch_scripts'])
gulp.task('up', done => sequence(
  'compile_assets',
  ['watch', 'server'],
  done)
);