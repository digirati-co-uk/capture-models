import React from 'react';
import { PluginProvider } from '@capture-models/plugin-api';
import { ChooseSelector } from './ChooseSelector';
// Import some fields.
import '../../selector-types/BoxSelector/index';

export default { title: 'Components|Choose selector' };

export const Simple: React.FC = () => {
  return (
    <PluginProvider>
      <ChooseSelector handleChoice={choice => console.log(choice)} />
    </PluginProvider>
  );
};
