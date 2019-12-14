import React from 'react';
import { Form } from 'semantic-ui-react';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { PluginProvider } from '../../core/plugins';
import { TextField } from './TextField';
import { text, select, withKnobs, boolean } from '@storybook/addon-knobs';

export default { title: 'Unsorted|TextField', decorators: [withKnobs] };

export const Simple: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <Form>
      <TextField
        type="text-field"
        value={value}
        updateValue={setValue}
        iconPosition={boolean('Left icon', false) ? 'left' : undefined}
        icon={select('Icon', ['', 'search', 'user'], '')}
      />
    </Form>
  );
};

export const WithFieldWrapper: React.FC = () => {
  return (
    <PluginProvider>
      <FieldWrapper
        field={{
          term: 'test',
          type: 'text-field',
          value: 'value 2',
          description: 'Some other longer description',
          label: 'Another field',
        }}
        onUpdateValue={value => console.log(value)}
      />
    </PluginProvider>
  );
};
