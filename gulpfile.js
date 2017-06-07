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

var help = {};

(function () {
   function standardTsProject(taskName, baseDir) {
      var buildDir = path.join(baseDir, 'dist');
      var tsconfigFile = path.join(baseDir, 'tsconfig.json');
      var tsProject = typescript.createProject(tsconfigFile, {
         typescript: require('typescript')
      });
      gulp.task('clean-' + taskName, function () {
         return del([path.join(buildDir, '**')]);
      });
      gulp.task('gen-' + taskName, function () {
         return tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject()).js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(buildDir));
      });
      gulp.task('build-' + taskName, function (callback) {
         runSequence('clean-' + taskName, 'gen-' + taskName, callback);
      });
   }
   gulp.task('clear-main-from-spec', function () {
      return del(['./spec/src/main-src/**']);
   });
   gulp.task('copy-main-to-spec', function () {
      return gulp.src('./main/src/**/*.ts')
         .pipe(gulpCopy('./spec/src/main-src', { prefix: 2 }));
   });

   standardTsProject('main', './main');
   standardTsProject('spec', './spec');
   standardTsProject('test', './spec');

   gulp.task('build-spec-with-main-src', function (callback) {
      runSequence('clear-main-from-spec',
      'copy-main-to-spec', 'build-spec', callback);
   });
   gulp.task('build-main-and-copy', function (callback) {
      runSequence('build-main', 'clear-main-from-spec',
      'copy-main-to-spec', callback);
   });

   gulp.task('build', ['build-main', 'build-spec-with-main-src']);
})();

(function () {
   gulp.task('test-only', function () {
      return gulp.src('./spec/dist/**/*.js')
         .pipe(replace('/main-src/', '/../../main/build/'))
         .pipe(jasmine())
   });
   gulp.task('clean-after-test', function () {
      return del(['./spec/dist/main-src/**']);
   });
   gulp.task('test', function (callback) {
      runSequence('build', 'test-only', 'clean-after-test', callback);
   });
})();

// ========
// ======== DEFAULT
// ========
gulp.task('default', function () { console.log("Meow"); });