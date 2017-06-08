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

var help = {};

(function () {
   function standardTsProject(taskName, baseDir) {
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
         runSequence(
            'lint-' + taskName,
            'clean-' + taskName,
            'gen-' + taskName, callback);
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
      runSequence(
         'clear-main-from-spec',
         'copy-main-to-spec',
         'build-spec', callback);
   });
   gulp.task('build-main-and-copy', function (callback) {
      runSequence(
         'build-main',
         'clear-main-from-spec',
         'copy-main-to-spec', callback);
   });

   gulp.task('build', runSequence(
      'build-main',
      'build-spec-with-main-src'));
})();

(function () {
   gulp.task('test-only', function () {
      return gulp.src('./spec/dist/**/*.js')
         .pipe(replace('/main-src/', '/../../main/build/'))
         .pipe(jasmine())
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
})();

// ========
// ======== DEFAULT
// ========
gulp.task('default', function () { console.log("Meow"); });