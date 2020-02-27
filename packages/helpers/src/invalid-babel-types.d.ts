import { CaptureModel } from '@capture-models/types';

type IsEntity = (entity: any) => entity is CaptureModel['document'];
type IsEntityList = (entity: any) => entity is CaptureModel['document'][];
