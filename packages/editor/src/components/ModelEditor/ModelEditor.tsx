import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Grid, Icon, Label, List } from 'semantic-ui-react';
import { expandModelFields, mergeFlatKeys, structureToFlatStructureDefinition } from '../../core/structure-editor';
import { SelectModelFields } from '../SelectModelFields/SelectModelFields';
import { StructureMetadataEditor } from '../StructureMetadataEditor/StructureMetadataEditor';
import { CaptureModel, ModelFields, StructureType } from '@capture-models/types';

type Props = {
  document: CaptureModel['document'];
  setLabel: (label: string) => void;
  model: StructureType<'model'>;
  modelFields: ModelFields;
  setDescription: (description: string) => void;
  setInstructions: (instructions: string) => void;
  setModelFields: (fields: ModelFields) => void;

  initialPath?: number[];
  popFocus: () => void;
};

// Set label
// Set description
// Add field
// Remove field
// @todo later
//   - Reorder fields
//   - Profile value

export const ModelEditor: React.FC<Props> = ({
  document,
  model,
  popFocus,
  modelFields,
  setLabel,
  setDescription,
  setInstructions,
  initialPath = [],
  setModelFields,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<string[][]>(() => expandModelFields(modelFields));

  const flatKeys = useMemo(() => mergeFlatKeys(selected), [selected]);

  useEffect(() => {
    if (flatKeys) {
      setModelFields(flatKeys);
    }
  }, [flatKeys, setModelFields]);

  return (
    <Card fluid>
      <Card.Content>
        <Grid>
          {initialPath.length ? (
            <Grid.Column width={2}>
              <Button icon="left arrow" onClick={() => popFocus()} />
            </Grid.Column>
          ) : null}
          <Grid.Column width={13}>
            <Card.Header>{model.label}</Card.Header>
            <Card.Meta>Model</Card.Meta>
          </Grid.Column>
        </Grid>
      </Card.Content>
      <Card.Content extra>
        <StructureMetadataEditor
          key={`${model.label}${model.description}${model.instructions}`}
          structure={model}
          onSave={values => {
            setLabel(values.label);
            setDescription(values.description || '');
            if (values.type === 'model') {
              setInstructions(values.instructions || '');
            }
          }}
        />
      </Card.Content>
      <Card.Content>
        <List size="large" verticalAlign="middle">
          {structureToFlatStructureDefinition(document, mergeFlatKeys(selected)).map((item, key) => (
            <List.Item key={key}>
              <List.Content floated="right">
                <Label style={{ marginRight: 5 }}>{item.type}</Label>
                <Button
                  color="red"
                  basic
                  size="mini"
                  onClick={() => {
                    // Remove the current item.
                    setSelected(selected.filter(r => r.join('--HASH--') !== item.key.join('--HASH--')));
                  }}
                >
                  Remove
                </Button>
              </List.Content>
              <Icon name={item.type === 'entity' ? 'box' : 'tag'} />
              <List.Content>
                <List.Header>{item.label}</List.Header>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Card.Content>
      <Card.Content>
        {isSelecting ? (
          <React.Fragment>
            <SelectModelFields
              document={document}
              selected={selected}
              onSave={m => {
                setIsSelecting(false);
                setSelected(s => (s ? [...s, m] : [m]));
              }}
            />
            <br />
            <Button onClick={() => setIsSelecting(false)}>Cancel</Button>
          </React.Fragment>
        ) : (
          <Button onClick={() => setIsSelecting(true)}>Add new field</Button>
        )}
      </Card.Content>
      <Card.Content extra>
        <pre>{JSON.stringify(mergeFlatKeys(selected), null, 2)}</pre>
      </Card.Content>
    </Card>
  );
};
