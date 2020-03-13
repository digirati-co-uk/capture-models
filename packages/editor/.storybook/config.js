import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(
  require.context(process.env.SRC_PATH, true, /\.stories\.(js|jsx|ts|tsx)$/),
  module
);

import 'semantic-ui-css/semantic.min.css';
import { setConsoleOptions } from '@storybook/addon-console';

setConsoleOptions({
  panelExclude: [],
});
