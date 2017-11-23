const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
const runSequence = require('run-sequence');
const tslint = require('gulp-tslint');
const cleanDest = require('gulp-clean-dest');
const gulpIgnore = require('gulp-ignore');
const MyReporter = require('./resources/MyReporter');
const del = require('del');
const fs = require('fs');
const merge = require('merge2');
const webpack = require('webpack-stream');
const through = require('through2');

const resetColor = '\x1b[0m';
function yellow(message) {
   const color = '\x1b[33m';
   return color + message + resetColor;
}

// ========
// ======== BUILD
// ========

const cwd = process.cwd();
const buildDir = path.join(cwd, 'dist');
const tmpBuildDir = path.join(cwd, 'dist-tmp');
const srcDir = path.join(cwd, 'src');
const tslintConfigurationFile = path.join(cwd, 'tslint.json');

gulp.task('lint', function () {
   return gulp.src(path.join(srcDir, '**', '*.ts'))
      .pipe(gulpIgnore.exclude(path.join(srcDir, '**', '*.d.ts')))
      .pipe(tslint({
         configuration: tslintConfigurationFile,
         formatter: 'verbose'
      }))
      .pipe(tslint.report({
         allowWarnings: true
      }));
});

gulp.task('spec-lint-custom', function () {
   return gulp.src(path.join(srcDir, '**', 'spec', '**', '*.ts'))
      .pipe(through.obj(function (chunk, enc, callback) {
         failed = false;
         const filePath = chunk.path;
         const contents = chunk._contents.toString();
         const isUnit = /Spec.ts$/.test(filePath);
         const isTest = contents.indexOf('describe') > -1;

         if (isTest && contents.indexOf('interface SS ') === -1) {
            logBad(isUnit, 'No SuiteScope interface', filePath);
         }

         const lines = contents.split('\n');
         for (let i = 0; i < lines.length; i++) {
            if (/\s+fit[\(\s]/.test(lines[i])) {
               logBad(true, 'Focused \'it\'', filePath, i, lines[i].indexOf('fit'));
            }
            if (/\s*fdescribe[\(\s]/.test(lines[i])) {
               logBad(true, 'Focused \'describe\'', filePath, i,
                  lines[i].indexOf('fdescribe'));
            }
            if (/\s+xit[\(\s]/.test(lines[i])) {
               logBad(false, 'Excluded \'it\'', filePath, i, lines[i].indexOf('xit'));
            }
            if (/\s*xdescribe[\(\s]/.test(lines[i])) {
               logBad(false, 'Excluded \'describe\'', filePath, i,
                  lines[i].indexOf('xdescribe'));
            }
            const isIt = /^\s*it\(/.test(lines[i]);
            const isBeforeEach = /^\s*beforeEach\(/.test(lines[i]);
            const isItOrBeforeEach = isIt || isBeforeEach;
            const isDescribe = /^\s*describe\(/.test(lines[i]);
            if (isIt || isDescribe) {
               if (/\+\s*$/.test(lines[i])) {
                  logBad(true, 'Description split in two', filePath, i,
                     lines[i].lastIndexOf('+'));
               }
            }
            if (isItOrBeforeEach && /,\s*function\s*\(\s*\)/.test(lines[i])) {
               logBad(false, 'No "this" in the function for an "it"', filePath, i,
                  lines[i].lastIndexOf('function'));
            }
            if (isItOrBeforeEach && /\s*=>\s*{$/.test(lines[i])) {
               logBad(true, 'Arrow function used at "it" or "beforeEach', filePath, i,
                  lines[i].lastIndexOf('>'));
            }
            if (isDescribe && /function[^"]*$/.test(lines[i])) {
               logBad(true, '"function" used at "describe"', filePath, i,
                  lines[i].lastIndexOf('function'))
            }
            if (isDescribe && /\)\: void => \{/.test(lines[i])) {
               logBad(false, 'Return type used at "describe"', filePath, i,
                  lines[i].lastIndexOf('=>'));
            }
         }

         callback(failed ? 'Invalid specs' : null, chunk);
      }));
});

gulp.task('general-lint-custom', function () {
   return gulp.src(path.join(srcDir, '**', '*.ts'))
      .pipe(through.obj(function (chunk, enc, callback) {
         const filePath = chunk.path;
         const contents = chunk._contents.toString();
         failed = false;

         const lines = contents.split('\n');
         let isJsDoc = false;
         for (let i = 0; i < lines.length; i++) {
            if (/import \{\w+\}/.test(lines[i])) {
               logBad(false, 'Import statement with no whitespace', filePath, i);
            }
            const leftSpaces = lines[i].trimRight().length - lines[i].trim().length;
            const trimmedLeft = lines[i].trimLeft();
            const isJsDocStart = trimmedLeft.indexOf('/**') === 0;
            const beginsWithAsterisk = trimmedLeft.indexOf('*') === 0;
            const isCommentEnd = trimmedLeft.indexOf('*/') === 0;
            if (isJsDoc && !beginsWithAsterisk) {
               logBad(true, 'JSDoc does not begin with an asterisk', filePath, i,
               leftSpaces);
            }
            if ((isJsDoc ? leftSpaces - 1 : leftSpaces) % 3 !== 0) {
               logBad(false, 'Incorrect indentation', filePath, i, leftSpaces);
            }
            isJsDoc = (isJsDoc || isJsDocStart) && !isCommentEnd;
         }

         callback(failed ? 'Invalid general code' : null, chunk);
      }));
});

let failed;
function logBad(isFatal, message, filePath, line, column) {
   failed = failed || isFatal;
   if (line !== undefined) {
      column = (column === undefined) ? 1 : (column + 1);
      line++;
      // filePath = filePath + ' [' + line + ', ' + column + ']';
      filePath = filePath + ':' + line + ':' + column;
   }
   if (isFatal) {
      console.error(yellow('[ ERROR ] ' + message + ': ' + filePath));
   } else {
      console.warn(yellow('[WARNING] ' + message + ': ' + filePath));
   }
}

gulp.task('clean', function (done) {
   del([buildDir]).then(function (test) {
      done();
   }).catch(function (err) {
      console.error(err.message);
   });
});

gulp.task('rename', function () {
   fs.renameSync(tmpBuildDir, buildDir);
});

gulp.task('gen', function () {
   const tsProject = typescript.createProject(path.join('.', 'tsconfig.json'), {
      declaration: true,
      typescript: require('typescript')
   });
   const result = tsProject.src()
      .pipe(sourcemaps.init())
      .pipe(tsProject());

   return merge([
      result.js
         .pipe(sourcemaps.write('.', { sourceRoot: '.' }))
         .pipe(cleanDest(tmpBuildDir))
         .pipe(gulp.dest(tmpBuildDir)),
      result.dts
         .pipe(gulp.dest(tmpBuildDir))
   ]);
});

gulp.task('gen-publish', function () {
   return gulp.src(cwd)
      .pipe(webpack(require('./webpack.config.js')))
      .pipe(gulp.dest(cwd));
});

gulp.task('build', function (callback) {
   runSequence('lint', 'gen', 'clean', 'rename', 'gen-publish', callback);
});

/**
 * Does the most extensive checks. Should be run before each commit.
 */
gulp.task('verify-all', function (callback) {
   runSequence('spec-lint-custom', 'general-lint-custom', 'build', 'test-only', callback);
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
   const indent = '   ';
   function log(indentation, msg) {
      var totalIndentation = '';
      for (var i = 0; i < indentation; i++) {
         totalIndentation += indent;
      }
      console.log(totalIndentation + msg);
   }
   log(0, 'There is no default task. The available tasks are:');
   log(1, 'build: build main and spec');
   log(1, 'test: build main and spec and only if it succeeds, run the tests');
});
