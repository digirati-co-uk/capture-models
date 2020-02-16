const config = require('@fesk/scripts/webpack');

config.devtool = 'sourcemap';

config.output.chunkFilename = '[name].bundle.js';

module.exports = config;
