import React from 'react';
import { Button, Grid, Segment, Header } from 'semantic-ui-react';
import { CaptureModel } from '../types/capture-model';
import { DocumentStore } from './document-store';
import { DocumentEditor } from '../components/DocumentEditor/DocumentEditor';
import { FieldEditor } from '../components/FieldEditor/FieldEditor';
import { FieldTypes } from '../types/field-types';
import { ErrorBoundary } from '../utility/ErrorBoundry';

export default { title: 'Document|Document Store' };

const model: CaptureModel = require('../../fixtures/simple.json');

const Test: React.FC = () => {
  const state = DocumentStore.useStoreState(s => ({
    subtree: s.subtree,
    subtreePath: s.subtreePath,
    subtreeFields: s.subtreeFields,
    selectedField: s.selectedFieldKey,
  }));
  const actions = DocumentStore.useStoreActions(a => a);

  return (
    <Grid padded>
      <Grid.Column width={6}>
        <DocumentEditor
          selectField={actions.selectField}
          setDescription={actions.setDescription}
          setLabel={actions.setLabel}
          popSubtree={actions.popSubtree}
          pushSubtree={actions.pushSubtree}
          subtree={state.subtree}
          subtreeFields={state.subtreeFields}
          subtreePath={state.subtreePath}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        {state.selectedField ? (
          <div>
            <ErrorBoundary key={state.selectedField}>
              <FieldEditor
                field={state.subtree.properties[state.selectedField][0] as FieldTypes}
                onSubmit={field => {
                  actions.setField({ field });
                  actions.deselectField();
                }}
              />
            </ErrorBoundary>
          </div>
        ) : (
          <Segment placeholder>
            <Header icon>No field selected</Header>
            <Segment.Inline>
              <Button>Add Document</Button>
              <Button>Add Field</Button>
            </Segment.Inline>
          </Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};

export const Simple: React.FC = () => (
  <DocumentStore.Provider initialData={model}>
    <Test />
  </DocumentStore.Provider>
);
