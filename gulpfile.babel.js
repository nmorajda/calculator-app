const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  reload = browserSync.reload,
  sourcemaps = require('gulp-sourcemaps'),
  pug = require('gulp-pug'),
  // imagemin = require('gulp-imagemin'),
  // webp = require('imagemin-webp'),
  // extReplace = require('gulp-ext-replace'),
  htmlmin = require('gulp-htmlmin'),
  sass = require('gulp-sass')(require('sass')),
  babel = require('gulp-babel'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');

const root = './',
  scss = root + 'src/scss/',
  js = root + 'src/js/',
  cssDest = root + 'www/css/',
  jsDest = root + 'www/js/';

const pugWatchFiles = root + 'src/templates/**/*.pug';
const imageWatchFiles = root + 'src/images/**/*.jpg';
const styleWatchFiles = scss + '**/*.scss';

const jsSrc = [
  js + 'main.js',
  //   js + 'bootstrap-hover.js',
  //   js + 'nav-scroll.js',
  //   js + 'prism.js',
  //   js + 'resizeSensor.js',
  //   js + 'sticky-sidebar.js',
  //   js + 'sticky-sb.js',
  //   js + 'skip-link-focus-fix.js'
];

function imageOpt() {
  return gulp
    .src('./src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./www/images'));
}

function pugToHtml() {
  return gulp
    .src('./src/templates/pages/*.pug')
    .pipe(
      pug({
        pretty: false,
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./www'));
}

function css() {
  return gulp
    .src(scss + 'main.scss', { sourcemaps: true })
    .pipe(
      sass({
        // outputStyle: 'compressed',
      }).on('error', sass.logError)
    )
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(cssDest, { sourcemaps: '.' }));
}

// function editorCSS() {
//   return gulp.src(scss + 'style-editor.scss' )
//     .pipe(sass({
//       outputStyle: 'expanded'
//     }).on('error', sass.logError))
//     .pipe(gulp.dest(root + 'dist/'));
// }

function javascript() {
  return (
    gulp
      .src(jsSrc)
      // Stop the process if an error is thrown.
      .pipe(plumber())
      // .pipe(sourcemaps.init())
      .pipe(
        babel({
          plugins: ['@babel/transform-runtime'],
        })
      )
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest(jsDest))
  );
}

function watch() {
  browserSync.init({
    open: 'external',
    proxy: 'http://localhost/1-PROJECTS/JavaScript/Calculator/www',
  });
  gulp.watch(pugWatchFiles, pugToHtml);
  // gulp.watch(imageWatchFiles, imageOpt);
  gulp.watch(styleWatchFiles, css);
  gulp.watch(jsSrc, javascript);
  gulp
    .watch([
      // imageWatchFiles,
      pugWatchFiles,
      jsDest + 'main.js',
      cssDest + 'main.css',
    ])
    .on('change', reload);
}

exports.css = css;
exports.pugToHtml = pugToHtml;
exports.javascript = javascript;
exports.watch = watch;

const build = gulp.series(watch);
gulp.task('default', build);
