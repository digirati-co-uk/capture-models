import { Action, Computed, Thunk, ThunkOn } from 'easy-peasy';
import { CaptureModel } from '../../types/capture-model';
import { FieldTypes } from '../../types/field-types';
import { SelectorTypes } from '../../types/selector-types';

export type DocumentModel = {
  document: CaptureModel['document'];
  subtreePath: string[];
  selectedFieldKey: string | null;

  subtree: Computed<DocumentModel, CaptureModel['document']>;
  subtreeFieldKeys: Computed<DocumentModel, string[]>;
  subtreeFields: Computed<DocumentModel, Array<{ term: string; value: CaptureModel['document'] | FieldTypes }>>;
  setSubtree: Action<DocumentModel, string[]>;
  pushSubtree: Action<DocumentModel, string>;
  popSubtree: Action<DocumentModel, { count: number } | undefined>;

  selectField: Action<DocumentModel, string>;
  deselectField: Action<DocumentModel>;

  addField: Action<DocumentModel, { term: string; field: FieldTypes; select?: boolean }>;
  removeField: Action<DocumentModel, string>;
  reorderField: Action<DocumentModel, { term: string; startIndex: number; endIndex: number }>;

  // @todo re-implement when JSON-LD extension
  // setContext: Action<DocumentModel, CaptureModel['document']['@context']>;

  setLabel: Action<DocumentModel, string>;
  setDescription: Action<DocumentModel, string>;
  setSelector: Action<DocumentModel, { selector: SelectorTypes | undefined }>;
  setSelectorState: Action<DocumentModel, { selectorType: string; selector: SelectorTypes['state'] }>;

  setField: Thunk<DocumentModel, { term?: string; field: FieldTypes }, any, DocumentModel>;
  setCustomProperty: Action<DocumentModel, { term?: string; key: string; value: any }>;

  setFieldLabel: Action<DocumentModel, { term?: string; label: string }>;
  setFieldDescription: Action<DocumentModel, { term?: string; description: string | undefined }>;
  setFieldSelector: Action<DocumentModel, { term?: string; selector: SelectorTypes | undefined }>;
  setFieldSelectorState: Action<
    DocumentModel,
    { term?: string; selectorType: string; selector: SelectorTypes['state'] }
  >;
  setFieldValue: Action<DocumentModel, { term?: string; value: FieldTypes['value'] }>;
  setFieldTerm: Action<DocumentModel, { oldTerm: string; newTerm: string }>;

  onDocumentChange: ThunkOn<DocumentModel>;
};
