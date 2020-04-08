import { StructureType } from '@capture-models/types';
import { Menu } from 'semantic-ui-react';
import React from 'react';

export const TabNavigation: React.FC<{
  currentId: string;
  onChoice: (id: string) => void;
  choice: StructureType<'choice'>;
}> = ({ choice, onChoice, currentId }) => {
  React.useEffect(() => {
    onChoice(choice.items[0].id);
  }, [choice.items, onChoice]);

  return (
    <Menu pointing secondary>
      {choice.items.map((model, key) => {
        // Possibly throw error.
        if (model.type !== 'model') return null;

        return (
          <Menu.Item key={key} name={model.label} active={currentId === model.id} onClick={() => onChoice(model.id)} />
        );
      })}
    </Menu>
  );
};
