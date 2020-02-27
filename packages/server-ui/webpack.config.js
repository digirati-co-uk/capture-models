const config = require('@fesk/scripts/webpack');

config.devtool = 'sourcemap';

config.output.chunkFilename = '[name].bundle.js';
config.output.publicPath = '/assets/umd/';

module.exports = config;
