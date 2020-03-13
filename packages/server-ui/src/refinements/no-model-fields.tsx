import { registerRefinement } from '@capture-models/plugin-api';
import { Message } from 'semantic-ui-react';
import React from 'react';

registerRefinement({
  type: 'revision-list',
  name: 'No model fields',
  supports: (subject, context) => {
    return subject.instance.type === 'model' && subject.instance.fields.length === 0;
  },
  refine() {
    return (
      <Message negative>
        <Message.Header>Invalid model</Message.Header>
        <p>This capture model has no fields configured.</p>
      </Message>
    );
  },
});
