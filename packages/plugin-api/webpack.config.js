const config = require('@fesk/scripts/webpack');

config.output.chunkFilename = '[name].bundle.js';
config.output.globalObject = "typeof self !== 'undefined' ? self : this";

config.externals = config.externals ? config.externals : {};

config.externals.react = 'react';
config.externals['react-dom'] = 'react-dom';

module.exports = config;
