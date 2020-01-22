import React, { useCallback, useState } from 'react';
import { Header, Label } from 'semantic-ui-react';
import { useField } from '../../core/plugins';
import { FieldTypes } from '../../types/field-types';

type Props<T extends FieldTypes = FieldTypes> = {
  field: FieldTypes;
  term?: string;
  showTerm?: boolean;
  onUpdateValue: (value: T['value']) => void;
};

export const FieldWrapper: React.FC<Props> = ({ field, term, onUpdateValue, showTerm }) => {
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
      <Header
        as="h3"
        content={
          <>
            {field.label}
            {showTerm ? <Label size="tiny">{term}</Label> : null}
          </>
        }
        subheader={field.description}
      />
      {/* @todo selector */}
      {/* @todo input type */}
      <div>{fieldComponent}</div>
    </div>
  );
};
