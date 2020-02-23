import { CaptureModel } from '@capture-models/types';
import { generateId } from './generate-id';

export const createDocument = (doc: Partial<CaptureModel['document']> = {}): CaptureModel['document'] => {
  return {
    id: generateId(),
    type: 'entity',
    label: 'Untitled document',
    properties: {},
    ...doc,
  };
};
