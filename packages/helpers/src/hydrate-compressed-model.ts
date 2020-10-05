import { CaptureModel } from '../../types/src/capture-model';
import { generateId } from './generate-id';
import { BaseField } from '../../types/src/field-types';
import { captureModelShorthand } from './capture-model-shorthand';
import { hydrateCaptureModel } from './hydrate-capture-model';

export function hydrateCompressedModel<T = any>({ __meta__, ...json }: T & { __meta__: { [key: string]: string } }) {
  return hydrateCaptureModel(captureModelShorthand(__meta__), json);
}
