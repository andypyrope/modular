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
const del = require('del');
const fs = require('fs');
const merge = require('merge2');

// ========
// ======== BUILD
// ========

const CWD = process.cwd();
const BUILD_DIR = path.join(CWD, 'dist');
const TMP_BUILD_DIR = path.join(CWD, 'dist-tmp');
const SRC_DIR = path.join(CWD, 'src');

gulp.task('lint', function () {
   return gulp.src(path.join(SRC_DIR, '**', '*.ts'))
      .pipe(gulpIgnore.exclude(path.join(SRC_DIR, '**', '*.d.ts')))
      .pipe(tslint({
         formatter: 'verbose'
      }))
      .pipe(tslint.report());
});

gulp.task('clean', function (done) {
   del([BUILD_DIR]).then(function (test) {
      done();
   }).catch(function (err) {
      console.error(err.message);
   });
});

gulp.task('rename', function () {
   fs.renameSync(TMP_BUILD_DIR, BUILD_DIR);
});

gulp.task('gen', function () {
   var tsProject = typescript.createProject(path.join('.', 'tsconfig.json'), {
      declaration: true,
      typescript: require('typescript')
   });
   var result = tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(tsProject());

   return merge([
      result.js
         .pipe(sourcemaps.write('.', { sourceRoot: '.' }))
         .pipe(cleanDest(TMP_BUILD_DIR))
         .pipe(gulp.dest(TMP_BUILD_DIR)),
      result.dts
         .pipe(gulp.dest(TMP_BUILD_DIR))
   ]);
});
gulp.task('build', function (callback) {
   runSequence('lint', 'gen', 'clean', 'rename', callback);
});

// ========
// ======== TEST
// ========

gulp.task('test-only', function () {
   return gulp.src('./dist/spec/**/*.js')
      .pipe(jasmine({ reporter: new MyReporter(SRC_DIR) }));
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
