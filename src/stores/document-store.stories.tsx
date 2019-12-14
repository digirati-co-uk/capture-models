import React from 'react';
import { Button, Card, Icon, Label, List, Grid } from 'semantic-ui-react';
import { CaptureModel } from '../types/capture-model';
import { DocumentStore } from './document-store';

export default { title: 'Document|Document Store' };

const model: CaptureModel = require('../../fixtures/simple.json');

const Test: React.FC = () => {
  const state = DocumentStore.useStoreState(s => s);
  const actions = DocumentStore.useStoreActions(a => a);

  // Actions:
  // - setSubtree
  // - pushSubtree
  // - popSubtree

  // - addField
  // - removeField
  // - reorderField
  // - setContext

  // - setFieldLabel
  // - setFieldDescription
  // - setSelector
  // - setSelectorState
  // - setFieldValue
  // - setFieldTerm

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <Card fluid={true}>
        <Card.Content>
          <Grid>
            {state.subtreePath.length ? (
              <Grid.Column width={2}>
                <Button icon="left arrow" onClick={() => actions.popSubtree()} />
              </Grid.Column>
            ) : null}
            <Grid.Column stretched={true}>
              <Card.Header>
                {state.subtree.label
                  ? state.subtree.label
                  : state.subtreePath.length === 0
                  ? 'Document root'
                  : 'Untitled entity'}
              </Card.Header>
              <Card.Meta>Entity</Card.Meta>
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          <List relaxed selection size="large">
            {state.subtreeFields.map((item, key) => (
              <List.Item
                key={key}
                onClick={() => {
                  if (item.type === 'entity') {
                    actions.pushSubtree(item.term);
                  }
                }}
              >
                <List.Content floated="right">
                  <Label>{item.type}</Label>
                </List.Content>
                <Icon name={item.type === 'entity' ? 'box' : 'tag'} />
                <List.Content>
                  <List.Header>{item.label}</List.Header>
                  {item.description ? <List.Description>{item.description}</List.Description> : null}
                </List.Content>
              </List.Item>
            ))}
          </List>
          <Button onClick={() => {}} fluid={true}>
            Add new field
          </Button>
        </Card.Content>
      </Card>
    </div>
  );
};

export const Simple: React.FC = () => (
  <DocumentStore.Provider initialData={model}>
    <Test />
  </DocumentStore.Provider>
);
