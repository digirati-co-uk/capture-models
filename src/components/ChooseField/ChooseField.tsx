import React, { useContext } from 'react';
import { PluginContext } from '../../core/plugins';
import { H4 } from '@blueprintjs/core';
import { Button, Card } from 'semantic-ui-react';
import { FieldSpecification, FieldTypeMap, FieldTypes } from '../../types/field-types';

export const ChooseField: React.FC<{
  handleChoice: <T extends FieldTypeMap[Type], Type extends keyof FieldTypeMap>(
    choice: FieldSpecification<T, Type>
  ) => void;
}> = ({ handleChoice }) => {
  const { fields } = useContext(PluginContext);

  return (
    <div>
      <h2>Choose field</h2>
      <ul>
        {Object.values(fields).map(field =>
          field ? (
            <Card style={{ marginBottom: 20 }}>
              <Card.Content>
                <H4>{field.label}</H4>
                <p>{field.description}</p>
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
