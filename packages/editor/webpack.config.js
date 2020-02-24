const config = require('@fesk/scripts/webpack');

config.output.chunkFilename = '[name].bundle.js';
config.output.globalObject = 'this';

config.externals = config.externals ? config.externals : {};

config.externals.react = 'react';
config.externals['react-dom'] = 'react-dom';
config.externals['styled-components'] = 'styled-components';

console.log(config);

module.exports = config;
