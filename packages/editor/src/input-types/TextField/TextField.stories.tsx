import React from 'react';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { PluginProvider } from '@capture-models/plugin-api';
import { TextField } from './TextField';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import './index';

export default { title: 'Input types|TextField', decorators: [withKnobs] };

export const Simple: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <form>
      <TextField id="1" label="Some label" type="text-field" value={value} updateValue={setValue} />
    </form>
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
export const WithFieldMultilineWrapper: React.FC = () => {
  return (
    <PluginProvider>
      <FieldWrapper
        field={
          {
            id: '1',
            type: 'text-field',
            value: 'value 2',
            description: 'Some other longer description',
            label: 'Another field',
            minLines: 10,
            multiline: true,
          } as any
        }
        onUpdateValue={value => console.log(value)}
      />
    </PluginProvider>
  );
};

export const TextFieldEditor: React.FC = () => {
  return (
    <PluginProvider>
      <div style={{ margin: 40 }}>
        <FieldEditor
          field={{
            id: '1',
            type: 'text-field',
            value: 'value 2',
            description: 'Some other longer description',
            label: 'Another field',
          }}
          onDelete={() => {
            console.log('deleted');
          }}
          onSubmit={newField => console.log(newField)}
        />
      </div>
    </PluginProvider>
  );
};
export const TextFieldEditorWithDataSource: React.FC = () => {
  return (
    <PluginProvider>
      <div style={{ margin: 40 }}>
        <FieldEditor
          sourceTypes={[
            {
              id: 'plaintext-source',
              name: 'Plaintext',
              description: 'Source plain-text from seeAlso fields in IIIF resources.',
              defaultProps: {},
              fieldTypes: ['text-field', 'html-field', 'tagged-text-field'],
            },
          ]}
          field={{
            id: '1',
            type: 'text-field',
            value: 'value 2',
            dataSources: ['plaintext-source'],
            description: 'Some other longer description',
            label: 'Another field',
          }}
          onDelete={() => {
            console.log('deleted');
          }}
          onSubmit={newField => console.log(newField)}
        />
      </div>
    </PluginProvider>
  );
};
