var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
const reporters = require('jasmine-reporters');
var runSequence = require('run-sequence');
var replace = require('gulp-replace');
var del = require('del');
var gulpCopy = require('gulp-copy');
var tslint = require("gulp-tslint");
var cleanDest = require('gulp-clean-dest');

// ========
// ======== BUILD
// ========

function standardTsProject(taskName, baseDir, options) {
   options = options || {};
   var buildDir = path.join(baseDir, 'dist');
   var srcDir = path.join(baseDir, 'src');
   var tsconfigFile = path.join(baseDir, 'tsconfig.json');
   var tsProject = typescript.createProject(tsconfigFile, {
      typescript: require('typescript')
   });
   gulp.task('lint-' + taskName, function () {
      return gulp.src(path.join(srcDir, "**", "*.ts"))
         .pipe(tslint({
            formatter: "verbose"
         }))
         .pipe(tslint.report())
   });
   gulp.task('gen-' + taskName, function () {
      var result = tsProject.src()
         .pipe(sourcemaps.init())
         .pipe(tsProject()).js
         .pipe(sourcemaps.write());
      if (options.postCompileCallback) {
         result = options.postCompileCallback(result);
      }
      return result.pipe(cleanDest(buildDir))
         .pipe(gulp.dest(buildDir));
   });
   gulp.task('build-' + taskName, function (callback) {
      runSequence(
         'lint-' + taskName,
         'gen-' + taskName, callback);
   });
}
gulp.task('copy-main-to-spec', function () {
   return gulp.src('./main/src/**/*.ts')
      .pipe(cleanDest('./spec/src/main-src'))
      .pipe(gulpCopy('./spec/src/main-src', { prefix: 2 }));
});

standardTsProject('main', './main');
standardTsProject('spec-without-copying-main', './spec', {
   postCompileCallback: function (result) {
      return result.pipe(replace('/main-src/', '/../../main/dist/'));
   }
});

gulp.task('build-spec', function (callback) {
   runSequence(
      'copy-main-to-spec',
      'build-spec-without-copying-main', callback);
});
gulp.task('build-main-and-copy', function (callback) {
   runSequence(
      'build-main',
      'clear-main-from-spec',
      'copy-main-to-spec', callback);
});

gulp.task('build', function (callback) {
   runSequence(
      'build-main',
      'build-spec', callback);
});

// ========
// ======== TEST
// ========

gulp.task('test-only', function () {
   return gulp.src('./spec/dist/**/*.js')
      .pipe(jasmine());
});
gulp.task('clean-main-src-dir', function () {
   return del(['./spec/dist/main-src/**']);
});
gulp.task('test', function (callback) {
   runSequence(
      'build',
      'clean-main-src-dir',
      'test-only', callback);
});

// ========
// ======== DEFAULT
// ========
gulp.task('default', function () {
   var INDENT = "   ";
   function log(indentation, msg) {
      var totalIndentation = "";
      for (var i = 0; i < indentation; i++) {
         totalIndentation += INDENT;
      }
      console.log(totalIndentation + msg);
   }
   log(0, "There is no default task. The available tasks are:");
   log(1, "build-main");
   log(1, "build-spec");
   log(1, "build: build main and only if it succeeds, build spec as well");
   log(1, "test: build main and spec and only if it succeeds, run the tests");
});