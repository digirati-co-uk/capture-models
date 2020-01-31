import React from 'react';
import { ChooseField } from './ChooseField';
// Import some fields.
import '../../input-types/TextField/index';
import '../../input-types/HTMLField';

import { PluginProvider } from '../../core/plugins';

export default { title: 'Components|Choose field' };

export const Simple: React.FC = () => {
  return (
    <PluginProvider>
      <ChooseField handleChoice={choice => console.log(choice)} />
    </PluginProvider>
  );
};
