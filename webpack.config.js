const webpack = require('webpack');
const path = require('path');
const yargs = require('yargs');

const LIBRARY_NAME = 'modular';
const plugins = [
   new DtsBundlePlugin()
];

const CWD = __dirname;

const ENTRY_FILE = path.join(CWD, 'src', 'main', 'index.ts');

module.exports = {
   entry: {
      'modular': ENTRY_FILE
   },
   devtool: null,
   output: {
      path: path.join(CWD),
      filename: "index.js",
      library: LIBRARY_NAME,
      libraryTarget: 'umd'
   },
   module: {
      preLoaders: [],
      loaders: [{
         test: /\.tsx?$/,
         loader: 'awesome-typescript-loader',
         exclude: /node_modules/
      }]
   },
   resolve: {
      root: path.resolve('./dist'),
      extensions: ['', '.js', '.ts', '.jsx', '.tsx']
   },
   target: 'node',
   plugins: plugins,
};

function DtsBundlePlugin() {
   // NOTE alalev: There is supposed to be nothing in this class
}

DtsBundlePlugin.prototype.apply = function (compiler) {
   compiler.plugin('done', function () {
      const dts = require('dts-bundle');

      dts.bundle({
         name: LIBRARY_NAME,
         main: 'dist/main/index.d.ts',
         indent: '   ',
         out: path.join(CWD, 'index.d.ts')
      });
   });
};