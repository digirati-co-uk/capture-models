import React from 'react';
import { DocumentEditor } from './DocumentEditor';
import { DocumentStore } from '../../stores/document/document-store';
import { CaptureModel } from '../../types/capture-model';

const model: CaptureModel = require('../../../fixtures/simple.json');

export default {
  title: 'Components|Document editor',
  component: DocumentEditor,
};

const Inner = () => {
  const state = DocumentStore.useStoreState(s => ({
    subtree: s.subtree,
    subtreePath: s.subtreePath,
    subtreeFields: s.subtreeFields,
  }));
  const actions = DocumentStore.useStoreActions(a => ({
    setLabel: a.setLabel,
    setDescription: a.setDescription,
    popSubtree: a.popSubtree,
    pushSubtree: a.pushSubtree,
    selectField: a.selectField,
    deselectField: a.deselectField,
    addField: a.addField,
  }));

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <DocumentEditor
        selectField={actions.selectField}
        deselectField={actions.deselectField}
        setDescription={actions.setDescription}
        setLabel={actions.setLabel}
        popSubtree={actions.popSubtree}
        pushSubtree={actions.pushSubtree}
        subtree={state.subtree}
        subtreeFields={state.subtreeFields}
        subtreePath={state.subtreePath}
        addField={actions.addField}
      />
    </div>
  );
};

export const Simple: React.FC = () => {
  return (
    <DocumentStore.Provider initialData={model}>
      <Inner />
    </DocumentStore.Provider>
  );
};
