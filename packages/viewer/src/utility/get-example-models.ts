import { CaptureModel } from '@capture-models/types';

export function getExampleModels(): CaptureModel[] {
  return [
    require('../../../../fixtures/01-basic/02-multiple-fields.json'),
    require('../../../../fixtures/01-basic/05-multiple-fields-multiple-values.json'),
    require('../../../../fixtures/03-revisions/01-single-field-with-revision.json'),
    require('../../../../fixtures/04-selectors/01-simple-selector.json'),
    require('../../../../fixtures/01-basic/04-nested-choice.json'),
    require('../../../../fixtures/02-nesting/01-nested-model.json'),
    require('../../../../fixtures/02-nesting/05-nested-model-multiple.json'),
  ] as CaptureModel[];
}
