import React from 'react';
import { PluginProvider } from '@capture-models/plugin-api';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { DropdownField } from './DropdownField';
import { withKnobs } from '@storybook/addon-knobs';
import './index';

export default { title: 'Input types|Dropdown', decorators: [withKnobs] };

export const Simple: React.FC = () => {
  const [value, setValue] = React.useState<string | undefined>('');
  return (
    <form>
      <DropdownField
        id="1"
        options={[
          { text: 'Test 1', value: '1' },
          { text: 'Test 2', value: '2' },
          { text: 'Test 3', value: '3' },
        ]}
        label="Some label"
        type="dropdown-field"
        value={value}
        updateValue={setValue}
      />
    </form>
  );
};

export const WithFieldWrapper: React.FC = () => {
  return (
    <PluginProvider>
      <FieldWrapper
        field={
          {
            id: '1',
            type: 'dropdown-field',
            value: 'value 2',
            options: [
              { text: 'Test 1', value: '1' },
              { text: 'Test 2', value: '2' },
              { text: 'Test 3', value: '3' },
            ],
            description: 'Some other longer description',
            label: 'Another field',
          } as any
        }
        onUpdateValue={value => console.log(value)}
      />
    </PluginProvider>
  );
};

export const DropdownFieldEditor: React.FC = () => {
  return (
    <PluginProvider>
      <div style={{ margin: 40 }}>
        <FieldEditor
          field={
            {
              id: '1',
              type: 'dropdown-field',
              value: undefined,
              options: [
                { text: 'Test 1', value: '1' },
                { text: 'Test 2', value: '2' },
                { text: 'Test 3', value: '3' },
              ],
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
