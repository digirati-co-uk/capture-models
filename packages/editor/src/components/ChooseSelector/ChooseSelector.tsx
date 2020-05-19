import React, { useContext } from 'react';
import { PluginContext } from '@capture-models/plugin-api';
import { Button } from '../../atoms/Button';
import {Card, CardContent, CardHeader} from '../../atoms/Card';
import { SelectorSpecification } from '@capture-models/types';
import { Tag } from '../../atoms/Tag';

export const ChooseSelector: React.FC<{
  handleChoice: (choice: SelectorSpecification) => void;
}> = ({ handleChoice }) => {
  const { selectors } = useContext(PluginContext);

  return (
    <div>
      <h2>Choose selector</h2>
      <ul>
        {Object.values(selectors).map(field =>
          field ? (
            <Card style={{ marginBottom: 20 }}>
              <CardContent>
                <CardHeader>{field.label}</CardHeader>
                <p>{field.description}</p>
              </CardContent>
              <CardContent extra>
                Supported content types
                <div>
                  {field.supportedContentTypes.map(type => (
                    <Tag key={type}>{type}</Tag>
                  ))}
                </div>
              </CardContent>
              <Button onClick={() => handleChoice(field as any)}>
                Create {field.label}
              </Button>
            </Card>
          ) : null
        )}
      </ul>
    </div>
  );
};
