import React from 'react';
import { Grid, Segment, Header } from 'semantic-ui-react';
import { CaptureModel } from '../../types/capture-model';
import { DocumentStore } from './document-store';
import { DocumentEditor } from '../../components/DocumentEditor/DocumentEditor';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import { FieldTypes } from '../../types/field-types';

export default { title: 'Stores|Document Store' };

const model: CaptureModel = require('../../../fixtures/simple.json');

// Import plugin
import '../../input-types/TextField/index';

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
          deselectField={actions.deselectField}
          popSubtree={actions.popSubtree}
          pushSubtree={actions.pushSubtree}
          subtree={state.subtree}
          subtreeFields={state.subtreeFields}
          selectedField={state.selectedField}
          subtreePath={state.subtreePath}
          addField={actions.addField}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        {state.selectedField ? (
          <div>
            <FieldEditor
              key={state.selectedField}
              field={state.subtree.properties[state.selectedField][0] as FieldTypes}
              onSubmit={field => {
                actions.setField({ field });
                actions.deselectField();
              }}
            />
          </div>
        ) : (
          <Segment placeholder>
            <Header icon>No field selected</Header>
          </Segment>
        )}
      </Grid.Column>
    </Grid>
  );
};

export const Simple: React.FC = () => (
  <DocumentStore.Provider initialData={{ captureModel: model }}>
    <Test />
  </DocumentStore.Provider>
);
