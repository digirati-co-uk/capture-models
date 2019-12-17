import React from 'react';
import { PluginProvider } from '../../core/plugins';
import { ChooseSelector } from './ChooseSelector';

// Import some fields.
import '../../selector-types/BoxSelector';

export default { title: 'Unsorted|Choose selector' };

export const Simple: React.FC = () => {
  return (
    <PluginProvider>
      <ChooseSelector handleChoice={choice => console.log(choice)} />
    </PluginProvider>
  );
};
