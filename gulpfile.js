"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const header = require("gulp-header");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const {src, dest} = require('gulp');

// Load package.json for banner
const pkg = require('./package.json');

// Set the banner content
const banner = `version: <%= pkg.version =>
  homepage: <%= pkg.homepage =>
  license: <%= pkg.license =>
  name: <%= pkg.name =>`

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./app"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean vendor
function clean() {
  return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Angular
  let angularJS = src('node_modules/angular/*.js')
    .pipe(dest('app/vendor/angular'));
  let angularRouter = src('node_modules/angular-route/*.js')
  .pipe(dest('app/vendor/angular-route'));
  let angularUiRouter = src('node_modules/angular-ui-router/release/*.js')
  .pipe(dest('app/vendor/angular-ui-router'));
  // Bootstrap JS
  let bootstrapJS = gulp.src('./node_modules/bootstrap/dist/js/*')
    .pipe(gulp.dest('./app/vendor/bootstrap/js'));
  // Bootstrap SCSS
  let bootstrapSCSS = gulp.src('./node_modules/bootstrap/scss/**/*')
    .pipe(gulp.dest('./app/vendor/bootstrap/scss'));
  // Font Awesome
  let fontAwesome = gulp.src('./node_modules/@fortawesome/**/*')
    .pipe(gulp.dest('./app/vendor'));
  // jQuery Easing
  let jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
    .pipe(gulp.dest('./app/vendor/jquery-easing'));
  // jQuery
  let jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('./app/vendor/jquery'));
  return merge(bootstrapJS, bootstrapSCSS, fontAwesome, jquery, jqueryEasing, angularJS, angularRouter, angularUiRouter);
}

// CSS task
function css() {
  return gulp
    .src("./app/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest("./app/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./app/css"))
    .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch("./app/scss/**/*", css);
  gulp.watch("./app/js/**/*", browserSyncReload);
  gulp.watch("./app/**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
