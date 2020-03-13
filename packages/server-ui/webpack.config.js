const config = require('@fesk/scripts/webpack');

config.devtool = 'eval-source-map';

config.output.chunkFilename = '[name].bundle.js';
config.output.publicPath = '/crowdsourcing-editor/assets/umd/';

module.exports = config;
