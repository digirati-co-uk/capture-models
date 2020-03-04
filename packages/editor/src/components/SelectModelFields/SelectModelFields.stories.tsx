import React, { useState } from 'react';
import { Button, Card, Label } from 'semantic-ui-react';
import { mergeFlatKeys, structureToFlatStructureDefinition } from '../../core/structure-editor';
import { SelectModelFields } from './SelectModelFields';
import { CaptureModel } from '@capture-models/types';

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
          <Button intent="danger" minimal={true} onClick={() => setIsSelecting(false)}>
            Cancel
          </Button>
        </React.Fragment>
      ) : (
        <Button onClick={() => setIsSelecting(true)}>Add new</Button>
      )}
      <Card style={{ marginTop: 20 }}>
        {structureToFlatStructureDefinition(model.document, mergeFlatKeys(selected)).map((struct, key) => (
          <div key={key} style={{ margin: 5 }}>
            {struct.label}
            <Label color="blue" style={{ marginRight: 5, marginLeft: 5 }}>
              {struct.type}
            </Label>
            {struct.key.map((s: string) => (
              <Label key={s} style={{ marginRight: 5 }}>
                {s}
              </Label>
            ))}
          </div>
        ))}
        <br />
        <pre>{JSON.stringify(mergeFlatKeys(selected), null, 2)}</pre>
      </Card>
    </div>
  );
};
