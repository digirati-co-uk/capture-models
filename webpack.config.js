
const config = require('@fesk/scripts/webpack');

config.output.chunkFilename = '[name].bundle.js';

module.exports = config;
