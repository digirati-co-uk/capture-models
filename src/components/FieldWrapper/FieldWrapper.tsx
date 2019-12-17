import React, { useCallback, useState } from 'react';
import { Header } from 'semantic-ui-react';
import { useField } from '../../core/plugins';
import { FieldTypes } from '../../types/field-types';

type Props<T extends FieldTypes = FieldTypes> = {
  field: FieldTypes;
  onUpdateValue: (value: T['value']) => void;
};

export const FieldWrapper: React.FC<Props> = ({ field, onUpdateValue }) => {
  const [value, setValue] = useState(field.value);

  const updateValue = useCallback(
    newValue => {
      setValue(newValue);
      onUpdateValue(newValue);
    },
    [onUpdateValue]
  );

  const fieldComponent = useField(field, value, updateValue);

  return (
    <div style={{ marginBottom: 30 }}>
      <Header as="h3" content={field.label} subheader={field.description} />
      {/* @todo selector */}
      {/* @todo term */}
      {/* @todo input type */}
      <div>{fieldComponent}</div>
    </div>
  );
};
