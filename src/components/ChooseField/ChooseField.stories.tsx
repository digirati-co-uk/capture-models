import React from 'react';
import { ChooseField } from './ChooseField';

export default { title: 'Unsorted|Choose field' };

// Import some fields.
import '../../input-types/TextField';
import '../../input-types/HTMLField';

import { PluginProvider } from '../../core/plugins';

export const Simple: React.FC = () => {
  return (
    <PluginProvider>
      <ChooseField handleChoice={choice => console.log(choice)} />
    </PluginProvider>
  );
};
