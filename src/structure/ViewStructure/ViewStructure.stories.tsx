import React from 'react';
import { CaptureModelProvider } from '../../core/capture-model-provider';
import { StructureStore } from '../../stores/structure-store';
import { CaptureModel } from '../../types/capture-model';
import { ViewStructure } from './ViewStructure';

export default { title: 'Structure|View structure' };

const model: CaptureModel = require('../../../fixtures/simple.json');

const withStructure = (Component: React.FC): React.FC => () => (
  <StructureStore.Provider initialData={model}>
    <Component />
  </StructureStore.Provider>
);

export const Simple: React.FC = withStructure(() => {
  const structure = StructureStore.useStoreState(s => s.structure);
  // @todo when does this become a stateful component?
  return <ViewStructure structure={structure as CaptureModel['structure']} />;
});
