import React from 'react';
import { FieldInstanceList } from '../../components/FieldInstanceList/FieldInstanceList';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { PluginProvider } from '@capture-models/plugin-api';
import { HTMLField } from './HTMLField';
import { withKnobs } from '@storybook/addon-knobs';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import './index';

export default { title: 'Input types|HTMLField', decorators: [withKnobs] };

export const Simple: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <form>
      <HTMLField id="1" label="Some label" type="html-field" value={value} updateValue={setValue} />
    </form>
  );
};

export const WithPreview: React.FC = () => {
  return (
    <PluginProvider>
      <FieldInstanceList
        property="test"
        fields={[
          {
            id: '1',
            type: 'html-field',
            value: '<p>testing html <strong>this is html</strong> <u>underlined</u> test</p>',
            description: 'Some other longer description',
            label: 'Another field',
          } as any,
        ]}
      />
    </PluginProvider>
  );
};

export const WithFieldWrapper: React.FC = () => {
  return (
    <PluginProvider>
      <FieldWrapper
        field={{
          id: '1',
          type: 'html-field',
          value: 'value 2',
          description: 'Some other longer description',
          label: 'Another field',
        }}
        onUpdateValue={value => console.log(value)}
      />
    </PluginProvider>
  );
};

export const HTMLFieldEditor: React.FC = () => {
  return (
    <PluginProvider>
      <div style={{ margin: 40 }}>
        <FieldEditor
          field={{
            id: '1',
            type: 'html-field',
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
