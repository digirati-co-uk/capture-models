import { Button, Card, Divider, Tag } from '@blueprintjs/core';
import React, { useState } from 'react';
import {
  mergeFlatKeys,
  structureToFlatStructureDefinition,
} from '../../editor/structure-editor';
import { CaptureModel } from '../../types/capture-model';
import { SelectModelFields } from './SelectModelFields';

export default { title: 'Structure|Select Model Fields' };

const model: CaptureModel = {
  structure: {
    label: 'root',
    type: 'model',
    fields: ['field1'],
  },
  document: {
    term: '@none',
    type: 'entity',
    properties: {
      field1: [
        { type: 'text-box', label: 'field 1', term: 'field1', value: '' },
      ],
      entity1: [
        {
          type: 'entity',
          label: 'Person entity',
          term: 'field2',
          properties: {
            field2: [
              {
                type: 'text-box',
                label: 'field 2',
                term: 'field2',
                value: '',
              },
            ],
            field3: [
              {
                type: 'text-box',
                label: 'field 3',
                term: 'field3',
                value: '',
              },
            ],
            field4: [
              {
                type: 'text-box',
                label: 'field 4',
                term: 'field4',
                value: '',
              },
            ],
          },
        },
      ],
    },
  },
};

export const Simple: React.FC = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<string[][]>([]);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      {isSelecting ? (
        <React.Fragment>
          <SelectModelFields
            document={model.document}
            selected={selected}
            onSave={m => {
              setIsSelecting(false);
              setSelected(s => [...s, m]);
            }}
          />
          <br />
          <Button
            intent="danger"
            minimal={true}
            onClick={() => setIsSelecting(false)}
          >
            Cancel
          </Button>
        </React.Fragment>
      ) : (
        <Button minimal={true} onClick={() => setIsSelecting(true)}>
          Add new
        </Button>
      )}
      <Card style={{ marginTop: 20 }}>
        {structureToFlatStructureDefinition(
          model.document,
          mergeFlatKeys(selected)
        ).map((struct, key) => (
          <div key={key} style={{ margin: 5 }}>
            {struct.label}
            <Tag intent="primary" style={{ marginRight: 5, marginLeft: 5 }}>
              {struct.type}
            </Tag>
            {struct.key.map((s: string) => (
              <Tag minimal={true} key={s} style={{ marginRight: 5 }}>
                {s}
              </Tag>
            ))}
          </div>
        ))}
        <br />
        <Divider />
        <pre>{JSON.stringify(mergeFlatKeys(selected), null, 2)}</pre>
      </Card>
    </div>
  );
};
