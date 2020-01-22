import React from 'react';
import { Form, Segment } from 'semantic-ui-react';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { PluginProvider } from '../../core/plugins';
import { TextField } from './TextField';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';

export default { title: 'Input types|TextField', decorators: [withKnobs] };

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
          id: '1',
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

export const TextFieldEditor: React.FC = () => {
  return (
    <PluginProvider>
      <Segment padded style={{ margin: 40 }}>
        <FieldEditor
          field={{
            id: '1',
            type: 'text-field',
            value: 'value 2',
            description: 'Some other longer description',
            label: 'Another field',
          }}
          onSubmit={newField => console.log(newField)}
        />
      </Segment>
    </PluginProvider>
  );
};
