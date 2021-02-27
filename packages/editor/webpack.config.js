const config = require('@fesk/scripts/webpack');

config.output.chunkFilename = '[name].bundle.js';
config.output.globalObject = 'this';

config.externals = config.externals
  ? config.externals
  : {
      react: 'react',
      'react-dom': 'react-dom',
      'styled-components': 'styled-components',
    };

module.exports = config;
