import React, { useState } from 'react';
import { BaseField, FieldComponent } from '@capture-models/types';
import { Select } from 'react-functional-select';
import { ErrorMessage } from '../../atoms/Message';
import { Tag } from '../../atoms/Tag';
import { useTranslation } from 'react-i18next';

export interface AutocompleteFieldProps extends BaseField {
  type: 'autocomplete-field';
  value: { uri: string; label: string; resource_class?: string } | undefined;
  placeholder?: string;
  clearable?: boolean;
  dataSource: string;
}

export type CompletionItem = {
  uri: string;
  label: string;
  resource_class?: string;
  score?: number;
};

function renderOptionLabel(option: CompletionItem) {
  return (
    <>
      <strong style={{ lineHeight: '1.8em', verticalAlign: 'middle' }}>{option.label}</strong>
      {option.resource_class ? <Tag style={{ float: 'right', marginLeft: 10 }}>{option.resource_class}</Tag> : null}
    </>
  );
}

export const AutocompleteField: FieldComponent<AutocompleteFieldProps> = props => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<CompletionItem[]>(props.value ? [props.value] : []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onOptionChange = (option: CompletionItem | undefined) => {
    if (!option) {
      props.updateValue(undefined);
      return;
    }

    if (!props.value || option.uri !== props.value.uri) {
      props.updateValue(
        option ? { label: option.label, resource_class: option.resource_class, uri: option.uri } : undefined
      );
    }
  };

  const onInputChange = () => {
    setIsLoading(true);
  };

  const onSearchChange = (value: string | undefined) => {
    if (value) {
      // Make API Request.
      fetch(`${props.dataSource}`.replace(/%/, value))
        .then(r => r.json() as Promise<{ completions: CompletionItem[] }>)
        .then(items => {
          setOptions(items.completions);
          setIsLoading(false);
          setError('');
        })
        .catch(() => {
          setError(t('There was a problem fetching results'));
        });
    }
  };

  return (
    <>
      <Select
        themeConfig={{
          color: {
            primary: '#005cc5',
          },
          control: {
            boxShadow: '0 0 0 0',
            focusedBorderColor: '#005cc5',
            selectedBgColor: '#005cc5',
            backgroundColor: '#fff',
          },
        }}
        isInvalid={!!error}
        inputId={props.id}
        initialValue={options[0]}
        placeholder={props.placeholder ? t(props.placeholder) : t('Select option...')}
        options={options}
        isLoading={isLoading}
        isClearable={props.clearable}
        onOptionChange={onOptionChange}
        noOptionsMsg={t('No options')}
        filterMatchFrom="any"
        onInputChange={onInputChange}
        onSearchChange={onSearchChange}
        getOptionValue={option => option.uri}
        getOptionLabel={option => option.label}
        renderOptionLabel={renderOptionLabel}
      />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </>
  );
};
