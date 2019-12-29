import { Button, Card, Divider, Tag } from '@blueprintjs/core';
import React, { useState } from 'react';
import { mergeFlatKeys, structureToFlatStructureDefinition } from '../../core/structure-editor';
import { CaptureModel } from '../../types/capture-model';
import { SelectModelFields } from './SelectModelFields';

export default { title: 'Components|Select Model Fields' };

const model: CaptureModel = require('../../../fixtures/simple.json');

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
          <Button intent="danger" minimal={true} onClick={() => setIsSelecting(false)}>
            Cancel
          </Button>
        </React.Fragment>
      ) : (
        <Button minimal={true} onClick={() => setIsSelecting(true)}>
          Add new
        </Button>
      )}
      <Card style={{ marginTop: 20 }}>
        {structureToFlatStructureDefinition(model.document, mergeFlatKeys(selected)).map((struct, key) => (
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
