import { CaptureModel } from '@capture-models/types';

export function isEntity(input: any): input is CaptureModel['document'] {
  return input.type === 'entity';
}

export function isEntityList(input: any): input is CaptureModel['document'][] {
  return input[0].type === 'entity';
}
