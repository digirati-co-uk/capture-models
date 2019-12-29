import { CaptureModel } from '../types/capture-model';

export const createDocument = (doc: Partial<CaptureModel['document']> = {}): CaptureModel['document'] => {
  return {
    type: 'entity',
    properties: {},
    ...doc,
  };
};
