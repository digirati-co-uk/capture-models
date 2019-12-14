import { ITreeNode } from '@blueprintjs/core';
import { action, Action, computed, Computed, createContextStore } from 'easy-peasy';
import { useCallback } from 'react';
import { createChoice, structureToTree } from '../editor/structure-editor';
import { CaptureModel, ModelFields, StructureType } from '../types/capture-model';

export type StructureModel = {
  // Main store.
  structure: CaptureModel['structure'];

  // Computed
  tree: Computed<StructureModel, ITreeNode[]>;

  // Currently focused item.
  focus: {
    index: number[];
    structure: Computed<StructureModel['focus'], CaptureModel['structure'], StructureModel>;
    breadcrumbs: Computed<StructureModel['focus'], Array<{ label: string; index: number[] }>, StructureModel>;
    setFocus: Action<StructureModel['focus'], number[]>;
    pushFocus: Action<StructureModel['focus'], number>;
  };

  // Actions.
  replaceTopLevelStructure: Action<StructureModel, { structure: CaptureModel['structure']; force?: boolean }>;
  addStructureToChoice: Action<StructureModel, { index: number[]; structure: CaptureModel['structure'] }>;
  removeStructureFromChoice: Action<StructureModel, { index: number[] }>;
  setStructureLabel: Action<StructureModel, { index: number[]; label: string }>;
  setStructureDescription: Action<StructureModel, { index: number[]; description: string }>;
  setStructureProfile: Action<StructureModel, { index: number[]; profile: string[] }>;
  setModelFields: Action<StructureModel, { index: number[]; fields: ModelFields }>;
  reorderChoices: Action<StructureModel, { index: number[]; startIndex: number; endIndex: number }>;
};

export const StructureStore = createContextStore<StructureModel, CaptureModel>(captureModel => ({
  structure: captureModel ? captureModel.structure : createChoice(),
  tree: computed(state => [structureToTree(state.structure as CaptureModel['structure']) as ITreeNode]),
  focus: {
    index: [],
    structure: computed([state => state.index, (state, storeState) => storeState.structure], (index, structure) =>
      index.reduce(
        (acc: CaptureModel['structure'], next: number) => {
          if (!acc || acc.type !== 'choice') {
            throw Error('Invalid index in focus.');
          }
          return acc.items[next];
        },
        structure as CaptureModel['structure']
      )
    ),
    breadcrumbs: computed(
      [state => state.index, (state, storeState) => storeState.structure],
      (index, structure) =>
        index.reduce(
          (acc, key) => {
            if (acc.choice.type !== 'choice') {
              // Invalid state.
              throw Error('Invalid path');
            }
            const choice = acc.choice.items[key] as StructureType<'choice'>;
            acc.breadcrumbs.push({ label: choice.label, index: [...acc.keyAcc, key] });
            acc.keyAcc.push(key);

            return {
              choice,
              breadcrumbs: acc.breadcrumbs,
              keyAcc: acc.keyAcc,
            };
          },
          {
            choice: structure as StructureType<'choice'>,
            breadcrumbs: [{ label: structure.label, index: [] }],
            keyAcc: [],
          } as {
            choice: StructureType<'choice'>;
            keyAcc: number[];
            breadcrumbs: Array<{ label: string; index: number[] }>;
          }
        ).breadcrumbs
    ),
    setFocus: action((state, index) => {
      state.index = index;
    }),
    pushFocus: action((state, index) => {
      state.index.push(index);
    }),
  },
  addStructureToChoice: action((state, { structure, index }) => {
    itemFromIndex(state, index).items.push(structure);
  }),
  removeStructureFromChoice: action((state, { index }) => {
    const toRemoveIndex = index.slice(-1)[0];
    const parentIndex = index.slice(0, -1);
    itemFromIndex(state, parentIndex).items.splice(toRemoveIndex, 1);
    if (state.focus.index.join('-') === index.join('-')) {
      state.focus.index = parentIndex;
    }
  }),
  setStructureLabel: action((state, { label, index }) => {
    itemFromIndex(state, index).label = label;
  }),
  setStructureDescription: action((state, { description, index }) => {
    itemFromIndex(state, index).description = description;
  }),
  setStructureProfile: action((state, { profile, index }) => {
    itemFromIndex(state, index).profile = profile;
  }),
  setModelFields: action((state, { index, fields }) => {
    itemFromIndex<'model'>(state, index).fields = fields;
  }),
  reorderChoices: action((state, { index, startIndex, endIndex }) => {
    // @todo check if currently selected will be invalidated.
    const result = itemFromIndex(state, index);
    if (result.type !== 'choice' || !result.items[startIndex] || !result.items[endIndex]) {
      return;
    }
    const [removed] = result.items.splice(startIndex, 1);
    result.items.splice(endIndex, 0, removed);
  }),
  replaceTopLevelStructure: action((state, payload) => {
    const structure = state.structure as CaptureModel['structure'];
    if (structure.type === 'choice' && structure.items.length > 0 && !payload.force) {
      // Error?
      return;
    }
    state.structure = payload.structure;
  }),
}));

function itemFromIndex<C extends string = 'choice', ST extends StructureType<C> = StructureType<C>>(
  state: any,
  index: number[]
): ST {
  return index.reduce((acc, next) => (acc as StructureType<'choice'>).items[next], state.structure);
}

export function useFocusedStructureEditor() {
  const actions = StructureStore.useStoreActions(act => ({
    setLabel: act.setStructureLabel,
    setDescription: act.setStructureDescription,
    setProfile: act.setStructureProfile,
    reorderChoices: act.reorderChoices,
    setModelFields: act.setModelFields,
  }));
  const index = StructureStore.useStoreState(state => state.focus.index);

  // Just calls the same functions with an added index parameter.
  const setLabel = useCallback((label: string) => actions.setLabel({ label, index }), [actions, index]);
  const setDescription = useCallback((description: string) => actions.setDescription({ description, index }), [
    actions,
    index,
  ]);
  const setProfile = useCallback((profile: string[]) => actions.setProfile({ profile, index }), [actions, index]);
  const setModelFields = useCallback((fields: ModelFields) => actions.setModelFields({ fields, index }), [
    actions,
    index,
  ]);
  const reorderChoices = useCallback(
    (startIndex: number, endIndex: number) => actions.reorderChoices({ startIndex, endIndex, index }),
    [actions, index]
  );

  return {
    index,
    setLabel,
    setDescription,
    setProfile,
    setModelFields,
    reorderChoices,
  };
}
