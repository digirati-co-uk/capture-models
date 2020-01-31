import { CaptureModel } from './capture-model';

export type StoredCaptureModel = {
  _id?: string;
  _rev?: string;
} & CaptureModel;
