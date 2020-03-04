import copy from 'fast-copy';
import React, { useContext, useEffect } from 'react';
import { Button, Card, Dropdown, Form as StyledForm, Grid, Icon, Label, List } from 'semantic-ui-react';
import { PluginContext } from '@capture-models/plugin-api';
import { useMiniRouter } from '../../hooks/useMiniRouter';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';
import { NewDocumentForm } from '../NewDocumentForm/NewDocumentForm';
import { NewFieldForm } from '../NewFieldForm/NewFieldForm';
import { SubtreeBreadcrumb } from '../SubtreeBreadcrumb/SubtreeBreadcrumb';
import { CaptureModel, BaseField, SelectorTypeMap, BaseSelector } from '@capture-models/types';

export type DocumentEditorProps = {
  setLabel: (label: string) => void;
  setDescription: (label: string) => void;
  setAllowMultiple: (allow: boolean) => void;
  setLabelledBy: (term: string) => void;
  selectField: (term: string) => void;
  popSubtree: (payload?: { count: number }) => void;
  pushSubtree: (term: string) => void;
  deselectField: (payload?: any) => void;
  addField: (payload?: any) => void;
  selectedField?: string | null;
  subtreePath: string[];
  subtree: CaptureModel['document'];
  subtreeFields: Array<{ term: string; value: CaptureModel['document'] | BaseField }>;
  setSelector: (payload: { term?: string; selector: BaseSelector | undefined }) => void;
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  setLabel,
  setDescription,
  selectField,
  deselectField,
  setAllowMultiple,
  setLabelledBy,
  addField,
  popSubtree,
  selectedField,
  subtreePath,
  subtree,
  subtreeFields,
  pushSubtree,
  setSelector,
}) => {
  const [route, router] = useMiniRouter(['list', 'newField', 'newDocument'], 'list');
  const { selectors } = useContext(PluginContext);
  const isRoot = subtreePath.length === 0;

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
                {!isRoot && (
                  <>
                    <StyledForm.Field>
                      <label>
                        Allow multiple instances
                        <StyledForm.Input
                          type="checkbox"
                          name="allowMultiple"
                          checked={!!subtree.allowMultiple}
                          value={!!subtree.allowMultiple}
                          onChange={e => setAllowMultiple(e.currentTarget.checked)}
                        />
                      </label>
                    </StyledForm.Field>
                  </>
                )}
                <StyledForm.Field>
                  <label>
                    Entity labelled by property
                    <Dropdown
                      placeholder="Choose property"
                      fluid
                      selection
                      value={subtree.labelledBy}
                      onChange={(_, ev) => {
                        setLabelledBy(ev.value as string);
                      }}
                      options={[
                        {
                          key: '',
                          value: '',
                          text: 'none',
                        },
                        ...subtreeFields.map(item => ({
                          key: item.term,
                          value: item.term,
                          text: item.value.label === item.term ? item.term : `${item.value.label} (${item.term})`,
                        })),
                      ]}
                    />
                  </label>
                </StyledForm.Field>
                <StyledForm.Field>
                  <label>
                    Choose selector (optional)
                    <ChooseSelectorButton
                      value={subtree.selector ? subtree.selector.type : ''}
                      onChange={t => {
                        if (t) {
                          const selector = selectors[t as keyof SelectorTypeMap];
                          if (selector) {
                            setSelector({
                              selector: {
                                type: selector.type,
                                state: copy(selector.defaultState),
                              } as any,
                            });
                          }
                        } else {
                          setSelector({ selector: undefined });
                        }
                      }}
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
                      <List.Header>{item.label === term ? term : `${item.label} (${term})`}</List.Header>
                      {item.description ? <List.Description>{item.description}</List.Description> : null}
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Card.Content>
            <Card.Content extra>
              <p>Add an nested entity field</p>
              <Button fluid onClick={router.newDocument}>
                Add Entity
              </Button>
            </Card.Content>
            <Card.Content extra>
              <p>Add a new field</p>
              <NewFieldForm
                key={Object.keys(subtree.properties).length}
                existingTerms={Object.keys(subtree.properties)}
                onSave={newField => {
                  // Use term to get plugin.
                  addField({
                    term: newField.term,
                    field: {
                      type: newField.fieldType,
                      label: newField.term,
                      value: newField.field.defaultValue,
                      selector: newField.selector
                        ? {
                            type: newField.selector.type,
                            state: copy(newField.selector.defaultState),
                          }
                        : undefined,
                      ...newField.field.defaultProps,
                    },
                    select: true,
                  });
                  router.list();
                }}
              />
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
                      selector: newField.selector
                        ? {
                            type: newField.selector.type,
                            state: copy(newField.selector.defaultState),
                          }
                        : undefined,
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
              </Grid>
            </Card.Content>

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
                      selector: newDoc.selector
                        ? {
                            type: newDoc.selector.type,
                            state: copy(newDoc.selector.defaultState),
                          }
                        : undefined,
                      properties: {},
                    },
                    select: true,
                  });
                  router.list();
                }}
              />
            </Card.Content>
          </>
        )}
      </Card>
    </div>
  );
};
