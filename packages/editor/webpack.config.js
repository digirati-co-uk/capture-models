const config = require('@fesk/scripts/webpack');

config.output.chunkFilename = '[name].bundle.js';
config.output.globalObject = 'this';

config.externals = config.externals
  ? config.externals
  : {
      react: 'React',
      'react-dom': 'ReactDOM',
    };

module.exports = config;
