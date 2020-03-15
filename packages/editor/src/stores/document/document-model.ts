import { CaptureModel, BaseField, BaseSelector } from '@capture-models/types';
import { Action, Computed, Thunk, ThunkOn } from 'easy-peasy';

export type DocumentModel = {
  document: CaptureModel['document'];
  subtreePath: string[];
  selectedFieldKey: string | null;

  subtree: Computed<DocumentModel, CaptureModel['document']>;
  subtreeFieldKeys: Computed<DocumentModel, string[]>;
  subtreeFields: Computed<DocumentModel, Array<{ term: string; value: CaptureModel['document'] | BaseField }>>;
  setSubtree: Action<DocumentModel, string[]>;
  pushSubtree: Action<DocumentModel, string>;
  popSubtree: Action<DocumentModel, { count: number } | undefined>;

  selectField: Action<DocumentModel, string>;
  deselectField: Action<DocumentModel>;

  addField: Action<DocumentModel, { term: string; field: BaseField; select?: boolean }>;
  removeField: Action<DocumentModel, string>;
  reorderField: Action<DocumentModel, { term: string; startIndex: number; endIndex: number }>;

  // @todo re-implement when JSON-LD extension
  // setContext: Action<DocumentModel, CaptureModel['document']['@context']>;

  setLabel: Action<DocumentModel, string>;
  setDescription: Action<DocumentModel, string>;
  setSelector: Action<DocumentModel, { selector: BaseSelector | undefined }>;
  setSelectorState: Action<DocumentModel, { selectorType: string; selector: BaseSelector['state'] }>;
  setAllowMultiple: Action<DocumentModel, boolean>;
  setLabelledBy: Action<DocumentModel, string>;
  setPluralLabel: Action<DocumentModel, string>;

  setField: Thunk<DocumentModel, { term?: string; field: BaseField }, any, DocumentModel>;
  setCustomProperty: Action<DocumentModel, { term?: string; key: string; value: any }>;

  setFieldLabel: Action<DocumentModel, { term?: string; label: string }>;
  setFieldDescription: Action<DocumentModel, { term?: string; description: string | undefined }>;
  setFieldSelector: Action<DocumentModel, { term?: string; selector: BaseSelector | undefined }>;
  setFieldSelectorState: Action<
    DocumentModel,
    { term?: string; selectorType: string; selector: BaseSelector['state'] }
  >;
  setFieldValue: Action<DocumentModel, { term?: string; value: BaseField['value'] }>;
  setFieldTerm: Action<DocumentModel, { oldTerm: string; newTerm: string }>;
  setFieldType: Action<DocumentModel, { term?: string; type: string; defaults?: any }>;

  onDocumentChange: ThunkOn<DocumentModel>;
};
