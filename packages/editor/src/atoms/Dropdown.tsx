import { useCallback, useMemo } from 'react';
import React from 'react';
import { Select } from 'react-functional-select';
import { Tag } from './Tag';

export type DropdownOption = {
  key: string;
  value: string;
  text: string;
  label?: string;
};

export type DropdownProps = {
  placeholder?: string;
  fluid?: boolean;
  disabled?: boolean;
  selection?: boolean;
  value?: string;
  options: Array<DropdownOption>;
  onChange: (value?: string) => void;
};

function getValue(option: DropdownOption) {
  return option.value;
}

function getOptionLabel(option: DropdownOption) {
  return (
    <>
      <strong style={{ lineHeight: '1.2em', verticalAlign: 'middle' }}>{option.text}</strong>
      {option.label ? <Tag style={{ float: 'right', marginLeft: 10 }}>{option.label}</Tag> : null}
    </>
  );
}

function getLabel(option: DropdownOption) {
  return option.text;
}

export const Dropdown: React.FC<DropdownProps> = ({ placeholder, value, disabled, fluid, options, onChange }) => {
  const onOptionChange = useCallback((option: DropdownOption | null): void => {
    if (option) {
      onChange(option ? option.value : undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValue = useMemo(() => {
    return options.find(item => item.value === value);
  }, [options, value]);

  return (
    <Select
      initialValue={initialValue}
      placeholder={placeholder}
      options={options}
      isDisabled={disabled}
      isClearable={false}
      onOptionChange={onOptionChange}
      getOptionValue={getValue}
      getOptionLabel={getLabel}
      renderOptionLabel={getOptionLabel}
    />
  );
};
