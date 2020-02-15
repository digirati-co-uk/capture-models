import { CaptureModel } from '@capture-models/types';

export function getExampleModels(): CaptureModel[] {
  return [
    require('../../../../fixtures/03-revisions/01-single-field-with-revision.json'),
    require('../../../../fixtures/04-selectors/01-simple-selector.json'),
    require('../../../../fixtures/01-basic/04-nested-choice.json'),
  ] as CaptureModel[];
}
