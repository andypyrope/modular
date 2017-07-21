var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var cleanDest = require('gulp-clean-dest');
var gulpIgnore = require('gulp-ignore');
var MyReporter = require('./MyReporter');

// ========
// ======== BUILD
// ========

var buildDir = path.join('.', 'dist');
var srcDir = path.join('.', 'src');
gulp.task('lint', function () {
   return gulp.src(path.join(srcDir, '**', '*.ts'))
      .pipe(gulpIgnore.exclude(path.join(srcDir, '**', '*.d.ts')))
      .pipe(tslint({
         formatter: 'verbose'
      }))
      .pipe(tslint.report());
});
gulp.task('gen', function () {
   var tsProject = typescript.createProject(path.join('.', 'tsconfig.json'), {
      typescript: require('typescript')
   });
   return tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(tsProject()).js
      .pipe(sourcemaps.write('.', { sourceRoot: '.' }))
      .pipe(cleanDest(buildDir))
      .pipe(gulp.dest(buildDir));
});
gulp.task('build', function (callback) {
   runSequence('lint', 'gen', callback);
});

// ========
// ======== TEST
// ========

gulp.task('test-only', function () {
   return gulp.src('./dist/spec/**/*.js')
      .pipe(jasmine({ reporter: new MyReporter(srcDir) }));
});
gulp.task('test', function (callback) {
   runSequence('build', 'test-only', callback);
});

// ========
// ======== DEFAULT
// ========
gulp.task('default', function () {
   var INDENT = '   ';
   function log(indentation, msg) {
      var totalIndentation = '';
      for (var i = 0; i < indentation; i++) {
         totalIndentation += INDENT;
      }
      console.log(totalIndentation + msg);
   }
   log(0, 'There is no default task. The available tasks are:');
   log(1, 'build: build main and spec');
   log(1, 'test: build main and spec and only if it succeeds, run the tests');
});
