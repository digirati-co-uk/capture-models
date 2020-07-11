import { PluginProvider } from '@capture-models/plugin-api';
import React from 'react';
import { FieldWrapper } from '../components/FieldWrapper/FieldWrapper';

export default { title: 'Input types | All types' };

export const AllFields: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <React.Suspense fallback="loading...">
        <PluginProvider>
          <FieldWrapper
            field={{
              id: '1',
              type: 'text-field',
              value: 'Value of the text field',
              description: 'Some other longer description',
              label: 'Text field',
            }}
            onUpdateValue={value => console.log(value)}
          />
          <FieldWrapper
            field={
              {
                id: '1',
                type: 'text-field',
                value: 'Value of the text field',
                multiline: true,
                description: 'Some other longer description',
                label: 'Text field',
              } as any
            }
            onUpdateValue={value => console.log(value)}
          />
          <FieldWrapper
            field={
              {
                id: '2',
                type: 'dropdown-field',
                value: '1',
                clearable: true,
                options: [
                  { text: 'Test 1', value: '1' },
                  { text: 'Test 2', value: '2' },
                  { text: 'Test 3', value: '3' },
                ],
                description: 'Some other longer description',
                label: 'Dropdown field',
              } as any
            }
            onUpdateValue={value => console.log(value)}
          />
          <FieldWrapper
            field={
              {
                id: '3',
                type: 'checkbox-field',
                value: 'value 2',
                description: 'Some other longer description',
                inlineLabel: 'Confirm this thing',
                label: 'Checkbox field',
              } as any
            }
            onUpdateValue={value => console.log(value)}
          />
          <FieldWrapper
            field={
              {
                id: '6',
                type: 'autocomplete-field',
                value: {
                  uri: 'http://id.worldcat.org/fast/fst00969633',
                  label: 'Indians of North America',
                  resource_class: 'Topic',
                },
                clearable: true,
                dataSource:
                  'https://gist.githubusercontent.com/stephenwf/8085651ddef94fb55f75c31fa33b36ab/raw/768995ed1a68eeeebd05bf791539682ae1cb5513/test.json?t=%',
                description: 'Some other longer description',
                label: 'Autocomplete field',
              } as any
            }
            onUpdateValue={value => console.log(value)}
          />
          <FieldWrapper
            field={
              {
                id: '4',
                type: 'tagged-text-field',
                value:
                  '<header>Testing a header</header><p>First paragraph</p><footer>This is a <strong>footer</strong> right.</footer>',
                preset: 'bentham',
                description: 'An HTML field',
                label: 'Tagged text field',
              } as any
            }
            onUpdateValue={value => console.log(value)}
          />
          <FieldWrapper
            field={{
              id: '5',
              type: 'html-field',
              value: 'value 2',
              description: 'Some other longer description',
              label: 'HTML field',
            }}
            onUpdateValue={value => console.log(value)}
          />
        </PluginProvider>
      </React.Suspense>
    </div>
  );
};
