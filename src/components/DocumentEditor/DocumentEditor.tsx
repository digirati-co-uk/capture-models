import React, { useEffect } from 'react';
import { Button, Card, Form as StyledForm, Grid, Icon, Label, List } from 'semantic-ui-react';
import { useMiniRouter } from '../../hooks/useMiniRouter';
import { CaptureModel } from '../../types/capture-model';
import { FieldTypes } from '../../types/field-types';
import { NewDocumentForm } from '../NewDocumentForm/NewDocumentForm';
import { NewFieldForm } from '../NewFieldForm/NewFieldForm';
import { SubtreeBreadcrumb } from '../SubtreeBreadcrumb/SubtreeBreadcrumb';

export type DocumentEditorProps = {
  setLabel: (label: string) => void;
  setDescription: (label: string) => void;
  selectField: (term: string) => void;
  popSubtree: (payload?: { count: number }) => void;
  pushSubtree: (term: string) => void;
  deselectField: (payload?: any) => void;
  addField: (payload?: any) => void;
  selectedField?: string | null;
  subtreePath: string[];
  subtree: CaptureModel['document'];
  subtreeFields: Array<{ term: string; value: CaptureModel['document'] | FieldTypes }>;
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  setLabel,
  setDescription,
  selectField,
  deselectField,
  addField,
  popSubtree,
  selectedField,
  subtreePath,
  subtree,
  subtreeFields,
  pushSubtree,
}) => {
  const [route, router] = useMiniRouter(['list', 'newField', 'newDocument'], 'list');

  useEffect(() => {
    if (route !== 'list') {
      deselectField();
    }
  }, [deselectField, route]);

  return (
    <div key={subtreePath.join('.')}>
      <Card fluid={true}>
        {route === 'list' ? (
          <>
            <Card.Content>
              <Grid>
                {subtreePath.length ? (
                  <Grid.Column width={2}>
                    <Button icon="left arrow" onClick={() => popSubtree()} />
                  </Grid.Column>
                ) : null}
                <Grid.Column width={13}>
                  <Card.Header>
                    <SubtreeBreadcrumb popSubtree={popSubtree} subtreePath={subtreePath} />
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
                    style={{ background: term === selectedField ? '#cbd3ed' : undefined }}
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
            </Card.Content>
            <Card.Content extra>
              <Grid columns={2}>
                <Grid.Column>
                  <Button fluid onClick={router.newDocument}>
                    Add Document
                  </Button>
                </Grid.Column>
                <Grid.Column>
                  <Button fluid onClick={router.newField}>
                    Add Field
                  </Button>
                </Grid.Column>
              </Grid>
            </Card.Content>
          </>
        ) : route === 'newField' ? (
          <>
            <Card.Content>
              <Grid>
                <Grid.Column width={2}>
                  <Button icon="left arrow" onClick={router.list} />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Card.Header>Create new field</Card.Header>
                </Grid.Column>
              </Grid>
            </Card.Content>
            <Card.Content extra>
              <NewFieldForm
                existingTerms={Object.keys(subtree.properties)}
                onSave={newField => {
                  // Use term to get plugin.
                  addField({
                    term: newField.term,
                    field: {
                      type: newField.fieldType,
                      label: newField.term,
                      value: newField.field.defaultValue,
                      ...newField.field.defaultProps,
                    },
                    select: true,
                  });
                  router.list();
                }}
              />
            </Card.Content>
          </>
        ) : (
          <>
            <Card.Content>
              <Grid>
                <Grid.Column width={2}>
                  <Button icon="left arrow" onClick={router.list} />
                </Grid.Column>
                <Grid.Column width={13}>
                  <Card.Header>Create new document</Card.Header>
                </Grid.Column>
                <Card.Content extra>
                  <NewDocumentForm
                    existingTerms={Object.keys(subtree.properties)}
                    onSave={newDoc => {
                      // Use term to get plugin.
                      addField({
                        term: newDoc.term,
                        field: {
                          type: 'entity',
                          label: newDoc.term,
                          properties: {},
                        },
                        select: true,
                      });
                      router.list();
                    }}
                  />
                </Card.Content>
              </Grid>
            </Card.Content>
          </>
        )}
      </Card>
    </div>
  );
};
