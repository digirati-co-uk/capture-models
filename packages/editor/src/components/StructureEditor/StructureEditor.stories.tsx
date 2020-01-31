import React from 'react';
import { DocumentStore } from '../../stores/document/document-store';
import { useFocusedStructureEditor } from '../../stores/structure/use-focused-structure-editor';
import { StructureEditor } from './StructureEditor';
import { StructureStore } from '../../stores/structure/structure-store';
import { CaptureModel } from '@capture-models/types';

export default { title: 'Components|Structure Editor' };

const model: CaptureModel = require('../../../../../fixtures/simple.json');

const withStructure = (Component: React.FC): React.FC => () => (
  <DocumentStore.Provider initialData={{ captureModel: model }}>
    <StructureStore.Provider initialData={{ captureModel: model }}>
      <Component />
    </StructureStore.Provider>
  </DocumentStore.Provider>
);

export const Simple: React.FC = withStructure(() => {
  const document = DocumentStore.useStoreState(state => state.document);
  const tree = StructureStore.useStoreState(state => state.tree);
  const focus = StructureStore.useStoreActions(act => act.focus);
  const current = StructureStore.useStoreState(state => state.focus.structure);
  const currentPath = StructureStore.useStoreState(state => state.focus.index);
  const {
    setLabel,
    setDescription,
    addStructureToChoice,
    setModelFields,
    removeStructureFromChoice,
  } = useFocusedStructureEditor();

  return (
    <StructureEditor
      tree={tree}
      document={document}
      setLabel={setLabel}
      setDescription={setDescription}
      onAddChoice={addStructureToChoice}
      onAddModel={addStructureToChoice}
      pushFocus={focus.pushFocus}
      popFocus={focus.popFocus}
      setFocus={focus.setFocus}
      onRemove={removeStructureFromChoice}
      currentPath={currentPath}
      setModelFields={setModelFields}
      structure={current as CaptureModel['structure']}
    />
  );
});
