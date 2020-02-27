import { CaptureModel } from '@capture-models/types';

const ctx = require.context('../../../../fixtures', true, /\.json$/);

export function getExampleModels(): CaptureModel[] {
  return ctx
    .keys()
    .map(key => ctx(key))
    .filter(model => Object.keys(model).length)
    .map(model => {
      if (model.structure && model.structure.id === undefined) {
        model.structure.description += ' – WARNING: NO IDS, EDITING WILL NOT WORK';
      }
      return model;
    }) as CaptureModel[];
}
