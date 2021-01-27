import copy from 'fast-copy';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardHeader, CardContent, CardMeta } from '../../atoms/Card';
import { Grid, GridColumn } from '../../atoms/Grid';
import { List, ListItem, ListHeader, ListContent, ListDescription } from '../../atoms/List';
import { Dropdown } from '../../atoms/Dropdown';
import { PluginContext } from '@capture-models/plugin-api';
import { useMiniRouter } from '../../hooks/useMiniRouter';
import { ChooseSelectorButton } from '../ChooseSelectorButton/ChooseSelectorButton';
import { NewDocumentForm } from '../NewDocumentForm/NewDocumentForm';
import { NewFieldForm } from '../NewFieldForm/NewFieldForm';
import { SubtreeBreadcrumb } from '../SubtreeBreadcrumb/SubtreeBreadcrumb';
import { CaptureModel, BaseField, SelectorTypeMap, BaseSelector } from '@capture-models/types';
import { Box } from '@styled-icons/entypo/Box';
import { Edit } from '@styled-icons/entypo/Edit';
import { Tag } from '../../atoms/Tag';
import { StyledForm, StyledFormField, StyledFormInput, StyledFormLabel, StyledCheckbox } from '../../atoms/StyledForm';
import { CardButton } from '../CardButton/CardButton';
import { CardButtonGroup } from '../CardButtonGroup/CardButtonGroup';
import { ConfirmButton } from '../../atoms/ConfirmButton';

export type DocumentEditorProps = {
  setLabel: (label: string) => void;
  setDescription: (label: string) => void;
  setAllowMultiple: (allow: boolean) => void;
  setLabelledBy: (label: string) => void;
  setPluralLabel: (label: string) => void;
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
  onDelete?: () => void;
};

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  setLabel,
  setDescription,
  selectField,
  deselectField,
  setAllowMultiple,
  setPluralLabel,
  setLabelledBy,
  addField,
  popSubtree,
  selectedField,
  subtreePath,
  subtree,
  subtreeFields,
  pushSubtree,
  setSelector,
  onDelete,
}) => {
  const [route, router] = useMiniRouter(['list', 'newField', 'newDocument'], 'list');
  const { selectors } = useContext(PluginContext);
  const isRoot = subtreePath.length === 0;
  const [metadataOpen, setMetadataOpen] = useState(false);

  const subtreeFieldOptions = useMemo(
    () => [
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
    ],
    [subtreeFields]
  );

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
            <CardContent>
              <Grid>
                {subtreePath.length ? (
                  <GridColumn>
                    <Button onClick={() => popSubtree()}>back</Button>
                  </GridColumn>
                ) : null}
                <GridColumn fluid>
                  <CardHeader>
                    <SubtreeBreadcrumb popSubtree={popSubtree} subtreePath={subtreePath} />
                  </CardHeader>
                  {subtree.description ? <CardMeta>{subtree.description}</CardMeta> : null}
                </GridColumn>
              </Grid>
            </CardContent>
            {metadataOpen ? (
              <CardContent extra>
                <StyledForm>
                  <StyledFormField>
                    <StyledFormLabel>
                      Label
                      <StyledFormInput
                        type="text"
                        name="label"
                        required={true}
                        value={subtree.label}
                        onChange={e => setLabel(e.currentTarget.value)}
                      />
                    </StyledFormLabel>
                  </StyledFormField>
                  <StyledFormField>
                    <StyledFormLabel>
                      Description
                      <StyledFormInput
                        type="textarea"
                        name="description"
                        value={subtree.description}
                        onChange={e => setDescription(e.currentTarget.value)}
                      />
                    </StyledFormLabel>
                  </StyledFormField>
                  {!isRoot && (
                    <>
                      <StyledFormField>
                        <StyledFormLabel>
                          <StyledCheckbox
                            type="checkbox"
                            name="allowMultiple"
                            checked={!!subtree.allowMultiple}
                            value={!!subtree.allowMultiple as any}
                            onChange={e => setAllowMultiple(e.currentTarget.checked)}
                          />
                          Allow multiple instances
                        </StyledFormLabel>
                      </StyledFormField>
                      {subtree.allowMultiple ? (
                        <StyledFormField>
                          <StyledFormLabel>
                            Plural label (used when referring to lists of this document)
                            <StyledFormInput
                              type="textarea"
                              name="pluralLabel"
                              value={subtree.pluralLabel}
                              onChange={e => setPluralLabel(e.currentTarget.value)}
                            />
                          </StyledFormLabel>
                        </StyledFormField>
                      ) : null}
                    </>
                  )}
                  <StyledFormField>
                    <StyledFormLabel>
                      Entity labelled by property
                      <Dropdown
                        placeholder="Choose property"
                        fluid
                        selection
                        value={subtree.labelledBy}
                        onChange={val => {
                          setLabelledBy(val || '');
                        }}
                        options={subtreeFieldOptions}
                      />
                    </StyledFormLabel>
                  </StyledFormField>
                  <StyledFormField>
                    <StyledFormLabel>
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
                    </StyledFormLabel>
                  </StyledFormField>
                </StyledForm>
                <Button size="tiny" onClick={() => setMetadataOpen(m => !m)}>
                  Close metadata
                </Button>
              </CardContent>
            ) : (
              <CardContent extra>
                <Button size="tiny" onClick={() => setMetadataOpen(m => !m)}>
                  Edit metadata
                </Button>
              </CardContent>
            )}
            <CardContent extra>
              <List>
                {subtreeFields.map(({ value: item, term }, key) => (
                  <ListItem
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
                    {item.type === 'entity' ? <Box size={16} /> : <Edit size={16} />}
                    <ListContent fluid>
                      <ListHeader>{item.label === term ? term : `${item.label} (${term})`}</ListHeader>
                      {item.description ? <ListDescription>{item.description}</ListDescription> : null}
                    </ListContent>
                    <ListContent>
                      <Tag>{item.type}</Tag>
                    </ListContent>
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardContent extra>
              <CardButtonGroup>
                <CardButton size="small" onClick={router.newField}>
                  Add field
                </CardButton>
                <CardButton size="small" onClick={router.newDocument}>
                  Add nested entity
                </CardButton>
              </CardButtonGroup>
            </CardContent>
            {onDelete ? (
              <CardContent extra>
                <CardButtonGroup>
                  <ConfirmButton
                    message="Are you sure you want to remove this and all of the fields in this list?"
                    onClick={() => onDelete()}
                  >
                    <Button type="button" alert>
                      Delete this entity
                    </Button>
                  </ConfirmButton>
                </CardButtonGroup>
              </CardContent>
            ) : null}
          </>
        ) : route === 'newField' ? (
          <>
            <CardContent>
              <Grid>
                <GridColumn>
                  <Button onClick={router.list}>back</Button>
                </GridColumn>
                <GridColumn fluid>
                  <CardHeader>Create new field</CardHeader>
                </GridColumn>
              </Grid>
            </CardContent>
            <CardContent extra>
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
            </CardContent>
          </>
        ) : (
          <>
            <CardContent>
              <Grid>
                <GridColumn>
                  <Button onClick={router.list}>back</Button>
                </GridColumn>
                <GridColumn fluid>
                  <CardHeader>Create new document</CardHeader>
                </GridColumn>
              </Grid>
            </CardContent>

            <CardContent extra>
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
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
