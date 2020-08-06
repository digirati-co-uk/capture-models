const path = require('path');
const baseConfig = require('@fesk/scripts/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MetalsmithWebpackPlugin = require('@fesk/plugin-metalsmith');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

const fullName = '@capture-models/editor';
const packageName = 'CaptureModelEditor';

const plugins = baseConfig.plugins
  .map(plugin => {
    if (plugin instanceof MetalsmithWebpackPlugin) {
      return null;
    }
    if (plugin instanceof CleanWebpackPlugin) {
      return new CleanWebpackPlugin({
        ...plugin.options,
        cleanOnceBeforeBuildPatterns: ['umd'],
      });
    }
    return plugin;
  })
  .filter(Boolean);

plugins.push(
  new StatsWriterPlugin({
    fields: ['assets', 'modules'],
  })
);

const config = Object.assign({}, baseConfig, {
  output: {
    path: path.resolve(process.cwd(), 'dist', 'umd'),
    filename: `${fullName}.js`,
    libraryTarget: 'umd',
    library: packageName,
    umdNamedDefine: true,
    chunkFilename: '[name].bundle.js',
    globalObject: 'this',
  },
  plugins,
  externals: baseConfig.externals,
});

config.stats = 'normal';

config.resolve.alias = {
  'react-textarea-autosize': require.resolve('react-textarea-autosize/dist/react-textarea-autosize.cjs.prod.js'),
  'detect-it': require.resolve('detect-it/lib/index.js'),
  immer: require.resolve('immer'),
  immutable: require.resolve('immutable'),
  'safe-buffer': require.resolve('safe-buffer'),
};

config.externals = {
  react: 'react',
  'react-dom': 'react-dom',
  'react-reconciler': 'react-reconciler',
  'styled-components': 'styled-components',
  '@atlas-viewer/atlas': '@atlas-viewer/atlas',
};

module.exports = config;
