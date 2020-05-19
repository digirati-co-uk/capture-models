import { DocumentEditor, DocumentStore, FieldEditor, StructureStore, Grid, GridColumn } from '@capture-models/editor';
import { BaseField } from '@capture-models/types';
import React from 'react';

export const FullDocumentEditor: React.FC = () => {
  const state = DocumentStore.useStoreState(s => ({
    subtree: s.subtree,
    subtreePath: s.subtreePath,
    subtreeFields: s.subtreeFields,
    selectedField: s.selectedFieldKey,
  }));
  const actions = DocumentStore.useStoreActions(a => a);
  const removeStructureField = StructureStore.useStoreActions(a => a.removeField);

  return (
    <Grid padded>
      <GridColumn>
        <DocumentEditor
          selectField={actions.selectField}
          setDescription={actions.setDescription}
          setLabel={actions.setLabel}
          setAllowMultiple={actions.setAllowMultiple}
          setLabelledBy={actions.setLabelledBy}
          setPluralLabel={actions.setPluralLabel}
          deselectField={actions.deselectField}
          popSubtree={actions.popSubtree}
          pushSubtree={actions.pushSubtree}
          subtree={state.subtree}
          subtreeFields={state.subtreeFields}
          selectedField={state.selectedField}
          subtreePath={state.subtreePath}
          addField={actions.addField}
          setSelector={actions.setSelector}
        />
      </GridColumn>
      <GridColumn>
        {state.selectedField ? (
          <div>
            <FieldEditor
              key={state.selectedField}
              term={state.selectedField}
              field={state.subtree.properties[state.selectedField][0] as BaseField}
              onChangeFieldType={(type, defaults) => {
                actions.setFieldType({
                  type,
                  defaults,
                });
                actions.deselectField();
                if (state.selectedField) {
                  actions.selectField(state.selectedField);
                }
              }}
              onSubmit={field => {
                actions.setField({ field });
                actions.setFieldSelector({ selector: field.selector });
                actions.deselectField();
              }}
              onDelete={() => {
                if (state.selectedField) {
                  actions.removeField(state.selectedField);
                  removeStructureField({ term: state.selectedField });
                }
                actions.deselectField();
              }}
            />
          </div>
        ) : (
          <div>
            <div>No field selected</div>
          </div>
        )}
      </GridColumn>
    </Grid>
  );
};
