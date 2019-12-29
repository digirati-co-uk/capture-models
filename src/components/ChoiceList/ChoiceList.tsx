import React from 'react';
import { Button, Icon, Label, List } from 'semantic-ui-react';
import { StructureType } from '../../types/capture-model';

type Props = {
  choice: StructureType<'choice'>;
  pushFocus: (key: number) => void;
  onRemove: (key: number) => void;
};

export const ChoiceList: React.FC<Props> = ({ onRemove, choice, pushFocus }) => (
  <List relaxed selection size="large">
    {choice.items.map((item, key) => (
      <List.Item
        onClick={() => {
          pushFocus(key);
        }}
      >
        <List.Content floated="right">
          <Button
            color="red"
            basic
            size="mini"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Remove the current item.
              onRemove(key);
            }}
          >
            Remove
          </Button>
          <Label>{item.type}</Label>
        </List.Content>
        <Icon name={item.type === 'model' ? 'tasks' : 'folder'} />
        <List.Content>
          <List.Header>{item.label}</List.Header>
          {item.description ? <List.Description>{item.description}</List.Description> : null}
        </List.Content>
      </List.Item>
    ))}
  </List>
);
