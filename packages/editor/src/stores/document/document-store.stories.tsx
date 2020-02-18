import { CaptureModel, BaseField } from '@capture-models/types';
import React from 'react';
import { Grid, Header, Segment } from 'semantic-ui-react';
import { DocumentStore } from './document-store';
import { DocumentEditor } from '../../components/DocumentEditor/DocumentEditor';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import '../../input-types/TextField/index';

export default { title: 'Stores|Document Store' };

const model: CaptureModel = require('../../../../../fixtures/simple.json');

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
          setSelector={actions.setSelector}
          selectField={actions.selectField}
          setDescription={actions.setDescription}
          setLabel={actions.setLabel}
          setLabelledBy={actions.setLabelledBy}
          setAllowMultiple={actions.setAllowMultiple}
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
              field={state.subtree.properties[state.selectedField][0] as BaseField}
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
