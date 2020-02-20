import { CaptureModel, Revision } from './capture-model';

export type RevisionRequest = {
  id?: string;
  source: 'structure' | 'canonical';
  document: CaptureModel['document'];
  revision: Revision;
};
