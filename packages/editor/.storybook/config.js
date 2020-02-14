import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(
  require.context(process.env.SRC_PATH, true, /\.stories\.(js|jsx|ts|tsx)$/),
  module
);

import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import 'semantic-ui-css/semantic.min.css';
import { setConsoleOptions } from '@storybook/addon-console';

setConsoleOptions({
  panelExclude: [],
});
