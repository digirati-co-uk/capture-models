import React from 'react';
import { Button, Card } from 'semantic-ui-react';
import { PluginProvider } from '../../core/plugins';
import { FieldWrapper } from './FieldWrapper';
// Import some plugins
import '../../input-types/TextField';

export default { title: 'Components|Field Wrapper' };

export const Simple: React.FC = () => {
  return (
    <PluginProvider>
      <Card fluid={true} style={{ margin: '40px auto', maxWidth: 500 }}>
        <Card.Content>
          <FieldWrapper
            field={{
              id: '1',
              type: 'text-field',
              value: 'value',
              description: 'Some description',
              label: 'Some label',
            }}
            showTerm={true}
            term="title"
            onUpdateValue={val => console.log(val)}
          />
          <FieldWrapper
            field={{
              id: '1',
              type: 'text-field',
              value: 'value 2',
              description: 'Some other longer description',
              label: 'Another field',
            }}
            showTerm={true}
            term="description"
            onUpdateValue={val => console.log(val)}
          />
        </Card.Content>
        <Card.Content style={{ background: '#eee' }} extra textAlign={'right'}>
          <Button primary type="submit">
            Save
          </Button>
        </Card.Content>
      </Card>
    </PluginProvider>
  );
};
