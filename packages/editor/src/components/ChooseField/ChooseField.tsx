import React, { useContext } from 'react';
import { PluginContext } from '@capture-models/plugin-api';
import { H4 } from '@blueprintjs/core';
import { Button, Card, Grid } from 'semantic-ui-react';
import { BaseField } from '@capture-models/types';

export const ChooseField: React.FC<{
  handleChoice: (choice: BaseField) => void;
}> = ({ handleChoice }) => {
  const { fields } = useContext(PluginContext);

  return (
    <div style={{ width: '100%' }}>
      <h2>Choose field</h2>
      <Grid>
        <Grid.Row>
          {Object.values(fields).map(field =>
            field ? (
              <Grid.Column width={4}>
                <Card style={{ marginBottom: 20 }}>
                  <Card.Content>
                    <H4>{field.label}</H4>
                    <p>{field.description}</p>
                  </Card.Content>
                  <Button primary onClick={() => handleChoice(field as any)}>
                    Create {field.label}
                  </Button>
                </Card>
              </Grid.Column>
            ) : null
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
};