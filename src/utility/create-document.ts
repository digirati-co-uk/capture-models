import { CaptureModel } from '../types/capture-model';
import generateId from 'nanoid';

export const createDocument = (doc: Partial<CaptureModel['document']> = {}): CaptureModel['document'] => {
  return {
    id: generateId(),
    type: 'entity',
    properties: {},
    ...doc,
  };
};
