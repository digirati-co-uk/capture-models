import React from 'react';
import { List } from 'semantic-ui-react';

type Props = {
  captureModels: Array<{ id: string; label: string }>;
  onDelete: (model: string) => void;
  onClick: (model: string) => void;
};

export const CaptureModelList: React.FC<Props> = ({ captureModels, onClick, onDelete }) => {
  return (
    <List>
      {captureModels.map(model => (
        <List.Item key={model.id}>
          <List.Header>{model.label}</List.Header>
          <List.Description>
            <a onClick={() => onClick(model.id)}>Edit</a> • <a onClick={() => onDelete(model.id)}>Delete</a>
          </List.Description>
        </List.Item>
      ))}
    </List>
  );
};
