import { ITreeNode } from '@blueprintjs/core';
import { CaptureModel, ModelFields } from '@capture-models/types';
import { Action, Computed, ThunkOn } from 'easy-peasy';

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
    popFocus: Action<StructureModel['focus'], any | undefined>;
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

  onStructureChange: ThunkOn<StructureModel>;
};
