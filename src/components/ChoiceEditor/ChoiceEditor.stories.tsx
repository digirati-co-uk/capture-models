import React from 'react';
import { StructureStore } from '../../stores/structure/structure-store';
import { useFocusedStructureEditor } from '../../stores/structure/use-focused-structure-editor';
import { CaptureModel, StructureType } from '../../types/capture-model';
import { ChoiceEditor } from './ChoiceEditor';

export default { title: 'Components|Choice Editor' };

const model: CaptureModel = require('../../../fixtures/simple.json');

const SimpleInner: React.FC = () => {
  const focus = StructureStore.useStoreActions(act => act.focus);
  const current = StructureStore.useStoreState(state => state.focus.structure);
  const currentPath = StructureStore.useStoreState(state => state.focus.index);
  const { setLabel, setDescription, addStructureToChoice, removeStructureFromChoice } = useFocusedStructureEditor();

  return (
    <ChoiceEditor
      setLabel={setLabel}
      setDescription={setDescription}
      choice={current as StructureType<'choice'>}
      onAddChoice={addStructureToChoice}
      onAddModel={addStructureToChoice}
      pushFocus={focus.pushFocus}
      popFocus={focus.popFocus}
      onRemove={removeStructureFromChoice}
      initialPath={currentPath}
    />
  );
};

export const Simple: React.FC = () => (
  <StructureStore.Provider initialData={{ captureModel: model }}>
    <div style={{ padding: 40 }}>
      <SimpleInner />
    </div>
  </StructureStore.Provider>
);
