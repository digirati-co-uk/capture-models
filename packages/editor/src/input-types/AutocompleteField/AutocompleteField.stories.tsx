import React from 'react';
import { PluginProvider } from '@capture-models/plugin-api';
import { FieldEditor } from '../../components/FieldEditor/FieldEditor';
import { FieldInstanceList } from '../../components/FieldInstanceList/FieldInstanceList';
import { FieldWrapper } from '../../components/FieldWrapper/FieldWrapper';
import { AutocompleteField, CompletionItem } from './AutocompleteField';
import { withKnobs } from '@storybook/addon-knobs';
import './index';

export default { title: 'Input types|Autocomplete', decorators: [withKnobs] };

export const Simple: React.FC = () => {
  const [value, setValue] = React.useState<CompletionItem | undefined>();
  return (
    <form>
      <AutocompleteField
        id="1"
        label="Some label"
        type="autocomplete-field"
        dataSource={
          'https://gist.githubusercontent.com/stephenwf/8085651ddef94fb55f75c31fa33b36ab/raw/768995ed1a68eeeebd05bf791539682ae1cb5513/test.json?t=%'
        }
        value={value}
        updateValue={setValue}
      />
    </form>
  );
};

export const SimpleWithEmpty: React.FC = () => {
  const [value, setValue] = React.useState<CompletionItem | undefined>();
  return (
    <form>
      <AutocompleteField
        id="1"
        label="Some label"
        type="autocomplete-field"
        emptyQuery
        dataSource={
          'https://gist.githubusercontent.com/stephenwf/8085651ddef94fb55f75c31fa33b36ab/raw/768995ed1a68eeeebd05bf791539682ae1cb5513/test.json?t=%'
        }
        value={value}
        updateValue={setValue}
      />
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
            type: 'autocomplete-field',
            value: {
              uri: 'http://id.worldcat.org/fast/fst00969633',
              label: 'Indians of North America',
              resource_class: 'Topic',
            },
            dataSource:
              'https://gist.githubusercontent.com/stephenwf/8085651ddef94fb55f75c31fa33b36ab/raw/768995ed1a68eeeebd05bf791539682ae1cb5513/test.json?t=%',
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
        field={
          {
            id: '1',
            type: 'autocomplete-field',
            value: {
              uri: 'http://id.worldcat.org/fast/fst00969633',
              label: 'Indians of North America',
              resource_class: 'Topic',
            },
            dataSource:
              'https://gist.githubusercontent.com/stephenwf/8085651ddef94fb55f75c31fa33b36ab/raw/768995ed1a68eeeebd05bf791539682ae1cb5513/test.json?t=%',
            description: 'Some other longer description',
            label: 'Another field',
          } as any
        }
        onUpdateValue={value => console.log(value)}
      />
    </PluginProvider>
  );
};

export const AutocompleteFieldEditor: React.FC = () => {
  return (
    <PluginProvider>
      <div style={{ margin: 40 }}>
        <FieldEditor
          field={
            {
              id: '1',
              type: 'autocomplete-field',
              value: {
                uri: 'http://id.worldcat.org/fast/fst00969633',
                label: 'Indians of North America',
                resource_class: 'Topic',
              },
              dataSource:
                'https://gist.githubusercontent.com/stephenwf/8085651ddef94fb55f75c31fa33b36ab/raw/768995ed1a68eeeebd05bf791539682ae1cb5513/test.json?t=%',
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
