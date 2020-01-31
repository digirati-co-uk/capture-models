import React, { useContext } from 'react';
import { PluginContext } from '@capture-models/plugin-api';
import { Button, Card, Label } from 'semantic-ui-react';
import { ContentTypeMap, SelectorSpecification, SelectorTypeMap } from '@capture-models/types';

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
              <Card.Content>
                <Card.Header>{field.label}</Card.Header>
                <p>{field.description}</p>
              </Card.Content>
              <Card.Content extra>
                Supported content types
                <div>
                  {field.supportedContentTypes.map(type => (
                    <Label>{type}</Label>
                  ))}
                </div>
              </Card.Content>
              <Button primary onClick={() => handleChoice(field as any)}>
                Create {field.label}
              </Button>
            </Card>
          ) : null
        )}
      </ul>
    </div>
  );
};
