import { Button, Card, H4 } from '@blueprintjs/core';
import React from 'react';

export const CreateStructure: React.FC<{
  enableWorkflow?: boolean;
  handleChoice: (choice: 'model' | 'choice' | 'workflow') => void;
}> = ({ handleChoice, enableWorkflow = true }) => {
  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <H4>Model</H4>
        <p>
          Add a capture model containing fields. When a user selects this from your application they will see a form
          with the fields you select for your model.
        </p>
        <Button onClick={() => handleChoice('model')} intent="primary">
          Create model
        </Button>
      </Card>
      <Card style={{ marginBottom: 20 }}>
        <H4>Choice</H4>
        <p>
          Organise two or more models into a choice. The user will be prompted to choose between the models you create
          under this choice.
        </p>
        <Button onClick={() => handleChoice('choice')} intent="primary">
          Create choice
        </Button>
      </Card>
      {enableWorkflow && (
        <Card style={{ marginBottom: 20 }}>
          <H4>Workflow</H4>
          <p>
            Organise a set of steps (models and reviews) for this capture model. Users will fill our each model in
            order, with optional reviews in between.
          </p>
          <Button onClick={() => handleChoice('workflow')} intent="primary">
            Create workflow
          </Button>
        </Card>
      )}
    </div>
  );
};
