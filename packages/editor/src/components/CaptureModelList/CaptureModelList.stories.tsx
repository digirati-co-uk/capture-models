import React from 'react';
import { Card } from 'semantic-ui-react';
import { CaptureModelList } from './CaptureModelList';

export default { title: 'Components|Capture Model List' };

export const Simple: React.FC = () => {
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
};
