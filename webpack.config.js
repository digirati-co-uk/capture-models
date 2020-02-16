const path = require('path');

module.exports = {
  resolve: {
    extensions: ['ts', 'tsx'],
    alias: {
      '@capture-model/': path.resolve(__dirname, './packages/'),
    },
  },
};
