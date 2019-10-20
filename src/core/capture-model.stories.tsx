import { CaptureModelProvider } from './capture-model-provider';
import React from 'react';
import { useCaptureModel } from './capture-model';

const withSimpleCaptureModel = (Component: React.FC): React.FC => () => (
  <CaptureModelProvider captureModel={model}>
    <Component />
  </CaptureModelProvider>
);

export default {
  title: 'State|Capture models',
};

import { CaptureModel } from '../../src/types/capture-model';

const model: CaptureModel = require('../../fixtures/simple.json');

export const Label: React.FC = withSimpleCaptureModel(() => {
  const { captureModel } = useCaptureModel();

  return <h1>{captureModel.structure.label}</h1>;
});
