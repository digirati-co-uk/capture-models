import { ITreeNode } from '@blueprintjs/core';
import { action, computed, createContextStore, thunkOn } from 'easy-peasy';
import { createChoice, structureToTree } from '../../core/structure-editor';
import { CaptureModel, StructureType } from '../../types/capture-model';
import { itemFromIndex } from '../../utility/item-from-index';
import { StructureModel } from './structure-model';

export const StructureStore = createContextStore<
  StructureModel,
  { captureModel: CaptureModel; onStructureChange?: (structure: CaptureModel['structure']) => void }
>(initial => ({
  structure: initial ? initial.captureModel.structure : createChoice(),
  tree: computed(state => [structureToTree(state.structure as CaptureModel['structure']) as ITreeNode]),
  focus: {
    index: [],
    structure: computed([state => state.index, (state, storeState) => storeState.structure], (index, structure) =>
      index.reduce((acc: CaptureModel['structure'], next: number) => {
        if (!acc || acc.type !== 'choice') {
          throw Error('Invalid index in focus.');
        }
        return acc.items[next];
      }, structure as CaptureModel['structure'])
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
    popFocus: action(state => {
      state.index = state.index.slice(0, -1);
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

  onStructureChange: thunkOn(
    actions => [
      actions.replaceTopLevelStructure,
      actions.addStructureToChoice,
      actions.removeStructureFromChoice,
      actions.setStructureLabel,
      actions.setStructureDescription,
      actions.setStructureProfile,
      actions.setModelFields,
      actions.reorderChoices,
    ],
    async (_, payload, store) => {
      if (initial && initial.onStructureChange) {
        const state = store.getStoreState() as StructureModel;
        initial.onStructureChange(state.structure);
      }
    }
  ),
}));
