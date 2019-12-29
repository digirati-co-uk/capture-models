import React from 'react';
import { List } from 'semantic-ui-react';
import { StoredCaptureModel } from '../../types/capture-model';

type Props = {
  captureModels: StoredCaptureModel[];
  onDelete: (model: StoredCaptureModel) => void;
  onClick: (model: StoredCaptureModel) => void;
};

export const CaptureModelList: React.FC<Props> = ({ captureModels, onClick, onDelete }) => {
  return (
    <List>
      {captureModels.map(model => (
        <List.Item>
          <List.Header>{model.structure.label}</List.Header>
          <List.Description>
            <a onClick={() => onClick(model)}>Edit</a> • <a onClick={() => onDelete(model)}>Delete</a>
          </List.Description>
        </List.Item>
      ))}
    </List>
  );
};
