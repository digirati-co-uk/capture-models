import React from 'react';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { PluginProvider } from '@capture-models/plugin-api';
import { TaggedTextField } from './TaggedTextField';
import { withKnobs } from '@storybook/addon-knobs';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import './index';

export default { title: 'Input types| Tagged text field', decorators: [withKnobs] };

export const Simple: React.FC = () => {
  const [value, setValue] = React.useState('');
  return (
    <form>
      <TaggedTextField id="1" label="Some label" type="text-field" value={value} updateValue={setValue} />
    </form>
  );
};

export const WithFieldWrapper: React.FC = () => {
  return (
    <PluginProvider>
      <FieldWrapper
        field={{
          id: '1',
          type: 'tagged-text-field',
          value: 'value 2',
          description: '<header>Testing a header</header><p>First paragraph</p><footer>This is a footer</footer>',
          label: 'Another field',
        }}
        onUpdateValue={value => console.log(value)}
      />
    </PluginProvider>
  );
};

export const TaggedTextFieldEditor: React.FC = () => {
  return (
    <PluginProvider>
      <div style={{ margin: 40 }}>
        <FieldEditor
          field={
            {
              id: '1',
              type: 'tagged-text-field',
              value: '<header>Testing a header</header><p>First paragraph</p><footer>This is a footer</footer>',
              preset: 'bentham',
              description: 'Some other longer description',
              label: 'Another field',
            } as any
          }
          onDelete={() => {
            console.log('deleted');
          }}
          onSubmit={newField => console.log(newField)}
        />
      </div>
    </PluginProvider>
  );
};
