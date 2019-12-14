import { CaptureModel, CaptureModelContext } from './capture-model';
import { NestedField } from './field-types';

export type UseCurrentForm<Model extends CaptureModel = CaptureModel> = {
  currentFields: NestedField<Model['document']>;
  updateFieldValue: (path: Array<[string, number]>, value: any) => void;
  createUpdateFieldValue: (partialPath: Array<[string, number]>) => CaptureModelContext['updateFieldValue'];
};
