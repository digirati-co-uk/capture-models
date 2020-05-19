import React from 'react';
import { StructureStore } from '../../stores/structure/structure-store';
import { useFocusedStructureEditor } from '../../stores/structure/use-focused-structure-editor';
import { ChoiceEditor } from './ChoiceEditor';
import { CaptureModel, StructureType } from '@capture-models/types';

export default { title: 'Components|Choice Editor' };

const model: CaptureModel = require('../../../../../fixtures/simple.json');

const SimpleInner: React.FC = () => {
  const focus = StructureStore.useStoreActions(act => act.focus);
  const current = StructureStore.useStoreState(state => state.focus.structure);
  const currentPath = StructureStore.useStoreState(state => state.focus.index);
  const { setLabel, setDescription, setProfile, addStructureToChoice, removeStructureFromChoice, reorderChoices } = useFocusedStructureEditor();

  return (
    <ChoiceEditor
      setProfile={setProfile}
      reorderChoices={reorderChoices}
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
