import React from 'react';
import { CaptureModel } from '../../types/capture-model';
import { RevisionStore } from './revisions-store';

export default { title: 'Stores|Revision Store' };

const models: CaptureModel[] = [
  require('../../../fixtures/03-revisions/01-single-field-with-revision.json'),
  require('../../../fixtures/03-revisions/02-single-field-with-multiple-revisions.json'),
  require('../../../fixtures/03-revisions/03-nested-revision.json'),
  require('../../../fixtures/03-revisions/04-dual-transcription.json'),
  require('../../../fixtures/03-revisions/05-allow-multiple-transcriptions.json'),
];

const Test: React.FC = () => {
  const state = RevisionStore.useStoreState(s => s);
  const actions = RevisionStore.useStoreActions(a => a);

  return (
    <div>
      <h3>Revision store</h3>
      {Object.values(state.revisions).map(revision => (
        <div>
          <h4>{revision.revision.label}</h4>
        </div>
      ))}
      <pre>
        <button
          onClick={() =>
            actions.createRevision({
              revisionId: 'test-person-a',
              cloneMode: 'FORK_TEMPLATE',
            })
          }
        >
          Create
        </button>
        <button
          onClick={() =>
            actions.selectRevision({
              revisionId: 'test-person-a',
            })
          }
        >
          Select first
        </button>
        <button
          onClick={() =>
            actions.createNewFieldInstance({
              path: [],
              property: 'transcription',
            })
          }
        >
          New instance
        </button>
        <button
          onClick={() =>
            actions.updateFieldValue({
              path: [['transcription', 'f2']],
              value: 'testing this value',
            })
          }
        >
          Update
        </button>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
    </div>
  );
};

export const Simple: React.FC = () => (
  <RevisionStore.Provider initialData={{ captureModel: models[4] }}>
    <Test />
  </RevisionStore.Provider>
);
