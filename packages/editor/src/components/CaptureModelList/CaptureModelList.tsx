import React from 'react';
import { List, Card } from 'semantic-ui-react';

type Props = {
  captureModels: Array<{ id: string; label: string }>;
  onDelete: (model: string) => void;
  onClick: (model: string) => void;
};

export const CaptureModelList: React.FC<Props> = ({ captureModels, onClick, onDelete }) => {
  return (
    <>
      {captureModels.map(model => (
        <Card key={model.id}>
          <Card.Content>
            <Card.Header>{model.label}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            <a onClick={() => onClick(model.id)}>Edit</a> | <a onClick={() => onDelete(model.id)}>Delete</a>
          </Card.Content>
        </Card>
      ))}
    </>
  );
};
