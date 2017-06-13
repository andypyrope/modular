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
var gulpIgnore = require('gulp-ignore');

// ========
// ======== BUILD
// ========

function standardTsProject(taskName, baseDir, options) {
   var suffix = taskName ? ('-' + taskName) : '';
   options = options || {};
   var buildDir = path.join(baseDir, 'dist');
   var srcDir = path.join(baseDir, 'src');
   var tsconfigFile = path.join(baseDir, 'tsconfig.json');
   var tsProject = typescript.createProject(tsconfigFile, {
      typescript: require('typescript')
   });
   gulp.task('lint' + suffix, function () {
      return gulp.src(path.join(srcDir, "**", "*.ts"))
         .pipe(gulpIgnore.exclude(path.join(srcDir, "**", "*.d.ts")))
         .pipe(tslint({
            formatter: "verbose"
         }))
         .pipe(tslint.report());
   });
   gulp.task('gen' + suffix, function () {
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
   gulp.task('build' + suffix, function (callback) {
      runSequence(
         'lint' + suffix,
         'gen' + suffix, callback);
   });
}
standardTsProject('', '.');

// ========
// ======== TEST
// ========

gulp.task('test-only', function () {
   return gulp.src('./dist/spec/**/*.js')
      .pipe(jasmine());
});
gulp.task('test', function (callback) {
   runSequence(
      'build',
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
   log(1, "build: build main and spec");
   log(1, "test: build main and spec and only if it succeeds, run the tests");
});