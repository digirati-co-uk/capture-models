import React from 'react';
import { Card } from 'semantic-ui-react';
import { DatabaseProvider, useAllDocs, useDatabase } from '../../core/database';
import { createChoice } from '../../utility/create-choice';
import { createDocument } from '../../utility/create-document';
import { CaptureModelList } from './CaptureModelList';
import { CaptureModel } from '@capture-models/types';

export default { title: 'Components|Capture Model List' };

const withDatabase = (Component: React.FC): React.FC => () => (
  <DatabaseProvider databaseName="capture-model-list">
    <Component />
  </DatabaseProvider>
);

export const Simple: React.FC = withDatabase(() => {
  const db = useDatabase();
  const models = useAllDocs<CaptureModel>();

  return (
    <Card fluid style={{ margin: 40 }}>
      <Card.Content>
        <CaptureModelList
          captureModels={models}
          onClick={e => console.log('onclick', e)}
          onDelete={e => db.remove({ _id: e._id as string, _rev: e._rev as string })}
        />
      </Card.Content>
      <button
        onClick={() => {
          db.post<CaptureModel>({
            structure: createChoice(),
            document: createDocument(),
          });
        }}
      >
        Add model
      </button>
    </Card>
  );
});
