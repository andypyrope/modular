console.log('foo');
var Parser = require('./dist/main/Parser').Parser;
var path = require('path');
new Parser(path.resolve(__dirname, 'project.xml'));