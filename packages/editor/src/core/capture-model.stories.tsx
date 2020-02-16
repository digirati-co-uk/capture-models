import { Card } from 'semantic-ui-react';
import { CaptureModelProvider } from './capture-model-provider';
import React from 'react';
import { useCaptureModel } from './capture-model';
// @ts-ignore
import notes from './capture-model.md';
import { CaptureModel } from '@capture-models/types';

const withSimpleCaptureModel = (Component: React.FC): React.FC => () => (
  <CaptureModelProvider captureModel={model}>
    <Component />
  </CaptureModelProvider>
);

export default {
  title: 'Core|Capture models',
  parameters: { notes },
};

const model: CaptureModel = require('../../../../fixtures/simple.json');

export const Label: React.FC = withSimpleCaptureModel(() => {
  const { captureModel } = useCaptureModel();

  return (
    <Card style={{ margin: '50px auto', padding: 20, maxWidth: 500 }} fluid>
      <h1>{captureModel.structure.label}</h1>
    </Card>
  );
});
