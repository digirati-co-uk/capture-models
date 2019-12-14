import { Tree } from '@blueprintjs/core';
import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { CaptureModel } from '../types/capture-model';
import { StructureStore, useFocusedStructureEditor } from './structure-store';

export default { title: 'Structure|Structure Store' };

const model: CaptureModel = require('../../fixtures/simple.json');

const Test: React.FC = () => {
  const tree = StructureStore.useStoreState(state => state.tree);
  const focus = StructureStore.useStoreActions(act => act.focus);
  const breadcrumbs = StructureStore.useStoreState(state => state.focus.breadcrumbs);
  const current = StructureStore.useStoreState(state => state.focus);
  const removeStructureFromChoice = StructureStore.useStoreActions(act => act.removeStructureFromChoice);
  const reorderChoices = StructureStore.useStoreActions(act => act.reorderChoices);
  const { setLabel } = useFocusedStructureEditor();

  return (
    <div>
      <Breadcrumb
        icon="right angle"
        sections={breadcrumbs.map(bread => ({
          key: `${bread.index.join('-')}`,
          content: bread.label,
        }))}
      />
      <button onClick={() => setLabel('to something else')}>Set label</button>
      <button onClick={() => removeStructureFromChoice({ index: current.index })}>Remove</button>
      <button onClick={() => reorderChoices({ index: current.index, startIndex: 0, endIndex: 1 })}>
        Flip first 2 items
      </button>
      <h1>{current.structure.label}</h1>
      <Tree
        contents={tree}
        onNodeClick={node => {
          const data = node.nodeData as any;
          focus.setFocus(data.key);
        }}
      />
    </div>
  );
};

export const Simple: React.FC = () => (
  <StructureStore.Provider initialData={model}>
    <Test />
  </StructureStore.Provider>
);
