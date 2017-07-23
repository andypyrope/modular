var find = require('find');
var fs = require('fs');

var COLOUR_BLUE = '\x1b[34m';
var COLOUR_RED = '\x1b[31m';
var COLOUR_YELLOW = '\x1b[33m';
var COLOUR_RESET = '\x1b[0m';
var COLOUR_CYAN = '\x1b[36m';

var COLOUR_BLINK = '\x1b[5m';

function MyReporter(srcDir) {
   this.srcDir = srcDir;
   this.failedSpecs = 0;
   this.failedE2eTests = 0;
   this.specsToPrint = [];
   this.specsRun = 0;
   this.e2eTestsRun = 0;
   this.totalSpecsDefined = undefined;
   this.lastPrintedPercentile = 0;
}

function printProgress(runSpecs, allSpecs, failedSpecs, percentDone) {
}

MyReporter.prototype.jasmineStarted = function (suiteInfo) {
   console.log(COLOUR_CYAN +
      '='.repeat(40) + '> JASMINE STARTED <' + '='.repeat(40) +
      COLOUR_RESET);
   this.totalSpecsDefined = suiteInfo.totalSpecsDefined;
};

function potentiallyIncorrectSpec(specName, fileName) {
   console.warn('The spec pattern may not have been followed for spec "' + specName +
      '" in file ' + filePath);
}

function findSpecLocation(fileName, srcDir, specName) {
   var files = find.fileSync(fileName, srcDir);
   if (files.length === 0) {
      console.warn('Could not find any source files with name ' + fileName);
      return null;
   }
   if (files.length > 1) {
      console.warn('Found ' + files.length + ' spec files with name ' + fileName +
         ' instead of 1!');
   }

   var filePath = files[0];
   var fileLines = fs
      .readFileSync(filePath).toString() // #readFileSync returns Buffer, not string
      .replace('\r', '') // Just in case, get rid of CRLF line endings
      .split('\n');

   var specParts = specName.split('WHEN');
   if (specParts[0].indexOf('#') > -1) {
      // If the first part contains a '#', then there must also be #methodName in the
      // full spec name, so it should be split there as well
      specParts = specParts[0]
         .split('#')
         .concat(specParts.slice(1));

      // If the part with '#' contains more than one word separated with an interval
      // then there should be a spec right under it without a 'THEN' statement
      var sharp = specParts[1].trim(); // #methodName does something
      if (sharp.indexOf(' ') > -1) {
         if (specParts.length > 2) {
            // It is not allowed for a spec to have "WHEN" in its message, for example:
            // ClassName #methodName
            potentiallyIncorrectSpec(specName, fileName);
         }

         specParts = [
            specParts[0], // ClassName
            sharp.substr(0, sharp.indexOf(' ')), // #methodName
            sharp.substr(sharp.indexOf(' ') + 1) // does something
         ].concat(specParts.slice(2)); // this should be empty; adding it just in case
      }
   }

   if (specParts[specParts.length - 1].indexOf('THEN') > -1) {
      // Split the last spec part, which must contain "THEN"
      specParts = specParts
         .slice(0, specParts.length - 1)
         .concat(specParts[specParts.length - 1].split('THEN'));
   } else {
      potentiallyIncorrectSpec(specName, fileName);
   }

   // Return the first position in the file before which all parts have been found
   var currentPart = 0;
   for (var i = 0; i < fileLines.length; i++) {
      var foundAt = fileLines[i].indexOf(specParts[currentPart].trim());
      if (foundAt > -1) {
         currentPart++;

         if (currentPart === specParts.length) {
            return [filePath, i + 1, foundAt + 1].join(':');
         }
      }
   }
   // Failure
   console.warn('Only found ' + currentPart + ' parts of the spec ' + specName +
      ' in file ' + filePath + ':');
   console.warn(specParts.slice(0, currentPart).join(' | '));
   return [filePath, 1, 1].join(':');
};

MyReporter.prototype.specDone = function (result) {
   if (result.status === 'disabled') {
      return;
   }
   this.specsRun++;

   var isE2e = (result.fullName.substr(0, 5) === '[E2E]');
   if (isE2e) {
      this.e2eTestsRun++;
   }

   if (result.failedExpectations.length) {
      this.failedSpecs++;
      if (isE2e) {
         this.failedE2eTests++;
      }

      var specFile = isE2e
         ? result.fullName.substr(6).match(/^[a-zA-Z]*/) + '.ts'
         : result.fullName.match(/^[a-zA-Z]*/) + 'Spec.ts';
      function inBlue(str) {
         return COLOUR_BLUE + str + COLOUR_RESET;
      }
      this.specsToPrint.push({
         name: result.description,
         fullName: result.fullName,
         file: specFile,
         errors: result.failedExpectations,
         location: findSpecLocation(specFile, this.srcDir, result.fullName)
      });
   }
   var percent = Math.round((this.specsRun / this.totalSpecsDefined) * 100);
   if (percent - this.lastPrintedPercentile > 3) {
      this.lastPrintedPercentile = percent;
      var failMessage = (this.failedSpecs > 0)
         ? (' ' + this.failedSpecs + ' failed')
         : '';
      var specsRunPadding = ' '.repeat(
         this.totalSpecsDefined.toString().length - this.specsRun.toString().length);
      var percentPadding = ' '.repeat(3 - percent.toString().length);
      console.log(specsRunPadding + this.specsRun + '/' + this.totalSpecsDefined +
         ' (' + percentPadding + percent + '%)' +
         failMessage);
   }
};

function printSpecs(specs) {
   for (var i = 0; i < specs.length; i++) {
      var spec = specs[i];
      var HEADER_PIECE = '='.repeat(20);
      console.log(COLOUR_RED + HEADER_PIECE +
         ' FAILURE ' + (i + 1) + '/' + specs.length + ' ' +
         HEADER_PIECE + COLOUR_RESET);
      var namePrefix = spec.fullName.substr(0, spec.fullName.indexOf(spec.name));
      console.log('Spec: ' + namePrefix + COLOUR_BLUE + spec.name + COLOUR_RESET);
      if (spec.location) {
         console.log(' ==>  ' + COLOUR_BLUE + spec.location + COLOUR_RESET);
      }
      for (var j = 0; j < spec.errors.length; j++) {
         console.error(spec.errors[j].stack);
      }
   }
}

MyReporter.prototype.jasmineDone = function () {
   console.log('Non-E2E specs run: ' + (this.specsRun - this.e2eTestsRun));
   console.log('E2E tests run: ' + this.e2eTestsRun);

   if (this.failedSpecs === 0) {
      console.log('All ' + this.specsRun + ' tests have passed!');
   } else {
      console.log('A total of ' + this.failedSpecs + ' out of ' + this.specsRun + ' (' +
         Math.round(100 * this.failedSpecs / this.specsRun) + '%) specs have failed');
      console.log('Among them, ' + this.failedE2eTests + ' are E2E tests');

      printSpecs(this.specsToPrint);
   }

   if (this.specsRun < this.totalSpecsDefined) {
      console.warn(COLOUR_BLINK + ' !!! WARNING !!!' + COLOUR_RESET);
      console.warn('Only ' + this.specsRun + ' out of ' + this.totalSpecsDefined +
         ' defined specs have been run. You have either focused ("fit"/"fdescribe") ' +
         'some of them or you have excluded ("xit"/"xdescribe") some.');
      // Heuristics
      var warning = null;
      if (this.specsRun < this.totalSpecsDefined / 2) {
         console.warn('Judging by how few specs have been run, they must be FOCUSED');
         warning = 'Please do not submit any focused tests!';
      } else {
         console.warn('Judging by how many specs have been run, the others must be ' +
            'EXCLUDED');
         warning = 'Please use exclusion only as a last resort!';
      }
      console.warn(COLOUR_BLINK + warning + COLOUR_RESET);
   }
};

module.exports = MyReporter;