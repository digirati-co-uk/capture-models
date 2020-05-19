import { CaptureModelList, CardButton } from '@capture-models/editor';
import { createChoice, createDocument, generateId } from '@capture-models/helpers';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useCaptureModelList } from '../hooks/use-capture-model-list';

export const CaptureModelListing: React.FC = () => {
  const [models, modelActions] = useCaptureModelList();
  const history = useHistory();

  return (
    <div style={{ padding: 40 }}>
      <CaptureModelList
        captureModels={models}
        onClick={id => history.push(`/editor/${id}`)}
        onDelete={id => {
          modelActions.remove(id);
        }}
      />
      <CardButton
        inline
        onClick={() => {
          const id = generateId();
          modelActions
            .create({
              id,
              structure: createChoice({ label: 'Untitled model' }),
              document: createDocument(),
            })
            .then(() => {
              history.push(`/editor/${id}`);
            });
        }}
      >
        Add model
      </CardButton>
    </div>
  );
};
