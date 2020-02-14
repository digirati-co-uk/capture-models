import { CaptureModel } from '@capture-models/types';
import { createStore } from 'easy-peasy';
import { createDocument } from '../../utility/create-document';
import { createRevisionStore } from './revisions-store';

const models: () => CaptureModel[] = () => [
  require('../../../../../fixtures/03-revisions/01-single-field-with-revision.json'),
  require('../../../../../fixtures/03-revisions/02-single-field-with-multiple-revisions.json'),
  require('../../../../../fixtures/03-revisions/03-nested-revision.json'),
  require('../../../../../fixtures/03-revisions/04-dual-transcription.json'),
  require('../../../../../fixtures/03-revisions/05-allow-multiple-transcriptions.json'),
  require('../../../../../fixtures/04-selectors/01-simple-selector.json'),
];

describe('Revision store', () => {
  test('create revision', () => {
    const store = createStore(createRevisionStore({ captureModel: models()[0] }));
    const { createRevision } = store.getActions();

    createRevision({ revisionId: 'c2', cloneMode: 'FORK_TEMPLATE' });

    const { revisions } = store.getState();

    expect(Object.keys(revisions).length).toEqual(3);
  });

  test('getting existing submissions', () => {

  })
});
