import React from 'react';
import { Card } from 'semantic-ui-react';
import { DatabaseProvider, useAllDocs, useDatabase } from '../../core/database';
import { createChoice, createDocument } from '@capture-models/helpers';
import { CaptureModelList } from './CaptureModelList';
import { CaptureModel } from '@capture-models/types';

export default { title: 'Components|Capture Model List' };

const withDatabase = (Component: React.FC): React.FC => () => (
  <DatabaseProvider databaseName="capture-model-list">
    <Component />
  </DatabaseProvider>
);

export const Simple: React.FC = withDatabase(() => {
  const models = [
    { label: 'Model A', id: '1' },
    { label: 'Model B', id: '2' },
  ];

  return (
    <Card fluid style={{ margin: 40 }}>
      <Card.Content>
        <CaptureModelList
          captureModels={models}
          onClick={e => console.log('onclick', e)}
          onDelete={e => console.log('remove', e)}
        />
      </Card.Content>
    </Card>
  );
});
