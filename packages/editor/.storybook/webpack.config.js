const config = require('@fesk/scripts/lib/scripts/parts/storybook/react/webpack.config');

module.exports = (props) => {

  props.config.module.rules.push({
    test: /\.stories\.tsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: { parser: 'typescript' },
      },
    ],
    enforce: 'pre',
  });

  return config(props);
};
