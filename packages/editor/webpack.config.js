const config = require('@fesk/scripts/webpack');

config.output.chunkFilename = '[name].bundle.js';

config.externals = config.externals ? config.externals : {};

config.externals.react = 'react';
config.externals['react-dom'] = 'react-dom';
config.externals['styled-components'] = 'styled-components';
config.externals['@capture-models/plugin-api'] = '@capture-models/plugin-api';

module.exports = config;

module.exports = config;
