import React, { useState } from 'react';
import { Button } from '../../atoms/Button';
import { Card, CardContent } from '../../atoms/Card';
import { mergeFlatKeys, structureToFlatStructureDefinition } from '../../core/structure-editor';
import { SelectModelFields } from './SelectModelFields';
import { CaptureModel } from '@capture-models/types';
import { Tag } from '../../atoms/Tag';

export default { title: 'Components|Select Model Fields' };

const model: CaptureModel = require('../../../../../fixtures/simple.json');

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
          <Button alert onClick={() => setIsSelecting(false)}>
            Cancel
          </Button>
        </React.Fragment>
      ) : (
        <Button onClick={() => setIsSelecting(true)}>Add new</Button>
      )}
      <Card fluid style={{ marginTop: 20 }}>
        <CardContent>
          {structureToFlatStructureDefinition(model.document, mergeFlatKeys(selected)).map((struct, key) => (
            <div key={key} style={{ margin: 5 }}>
              {struct.label}
              <Tag blue style={{ marginRight: 5, marginLeft: 5 }}>
                {struct.type}
              </Tag>
              {struct.key.map((s: string) => (
                <Tag key={s} style={{ marginRight: 5 }}>
                  {s}
                </Tag>
              ))}
            </div>
          ))}
        </CardContent>
        <CardContent extra>
          <pre>{JSON.stringify(mergeFlatKeys(selected), null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
};
