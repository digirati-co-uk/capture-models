import { CaptureModel } from '@capture-models/types';
import { Structure } from '../entity/Structure';

function fromStructure(input: CaptureModel['structure']): Structure {
  return new Structure();
}
