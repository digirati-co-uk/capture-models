import React, { useContext } from 'react';
import { PluginContext } from '../../core/plugins';
import { H4 } from '@blueprintjs/core';
import { Button, Card, Label } from 'semantic-ui-react';
import { SelectorContentTypeMap, SelectorSpecification, SelectorTypeMap } from '../../types/selector-types';

export const ChooseSelector: React.FC<{
  handleChoice: <
    T extends SelectorTypeMap[Type],
    Type extends keyof SelectorTypeMap,
    CT extends keyof SelectorContentTypeMap
  >(
    choice: SelectorSpecification<T, Type, CT>
  ) => void;
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
