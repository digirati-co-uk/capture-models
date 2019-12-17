import React from 'react';
import { Button, Card, Form as StyledForm, Grid, Icon, Label, List } from 'semantic-ui-react';
import { CaptureModel } from '../../types/capture-model';
import { FieldTypes } from '../../types/field-types';
import { Field, Form, Formik } from 'formik';

export type DocumentEditorProps = {
  setLabel: (label: string) => void;
  setDescription: (label: string) => void;
  selectField: (term: string) => void;
  popSubtree: (payload?: any) => void;
  pushSubtree: (term: string) => void;
  subtreePath: string[];
  subtree: CaptureModel['document'];
  subtreeFields: Array<{ term: string; value: CaptureModel['document'] | FieldTypes }>;
};

/*
  Things to Edit - label, description + selector effectively
  ===========================
  label?: string;
  description?: string;
  type: 'entity';
  selector?: SelectorTypes;
  properties: {
    [term: string]: Array<FieldTypes> | Array<CaptureModel['document']>;
  };
 */

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  setLabel,
  setDescription,
  selectField,
  popSubtree,
  subtreePath,
  subtree,
  subtreeFields,
  pushSubtree,
}) => {
  return (
    <div key={subtreePath.join('.')}>
      <Card fluid={true}>
        <Card.Content>
          <Grid>
            {subtreePath.length ? (
              <Grid.Column width={2}>
                <Button icon="left arrow" onClick={() => popSubtree()} />
              </Grid.Column>
            ) : null}
            <Grid.Column width={13}>
              <Card.Header>
                {subtree.label ? subtree.label : subtreePath.length === 0 ? 'Document root' : 'Untitled entity'}
              </Card.Header>
              {subtree.description ? <Card.Meta>{subtree.description}</Card.Meta> : null}
            </Grid.Column>
          </Grid>
        </Card.Content>
        <Card.Content extra>
          <StyledForm>
            <StyledForm.Field>
              <label>
                Label
                <StyledForm.Input
                  type="text"
                  name="label"
                  required={true}
                  value={subtree.label}
                  onChange={e => setLabel(e.currentTarget.value)}
                />
              </label>
            </StyledForm.Field>
            <StyledForm.Field>
              <label>
                Description
                <StyledForm.Input
                  type="textarea"
                  name="description"
                  value={subtree.description}
                  onChange={e => setDescription(e.currentTarget.value)}
                />
              </label>
            </StyledForm.Field>
          </StyledForm>
        </Card.Content>
        <Card.Content extra>
          <List relaxed selection size="large">
            {subtreeFields.map(({ value: item, term }, key) => (
              <List.Item
                key={key}
                onClick={() => {
                  if (item.type === 'entity') {
                    pushSubtree(term);
                  } else {
                    selectField(term);
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
