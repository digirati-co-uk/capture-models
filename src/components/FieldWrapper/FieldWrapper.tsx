import React, { useCallback, useState } from 'react';
import { useField, useSelectorStatus } from '../../core/plugins';
import { FieldTypes } from '../../types/field-types';
import { FieldHeader2 } from '../FieldHeader/FieldHeader2';

type Props<T extends FieldTypes = FieldTypes> = {
  field: FieldTypes;
  term?: string;
  showTerm?: boolean;
  onUpdateValue: (value: T['value']) => void;

  // @todo other things for the selector.
  // onChooseSelector()
  // onClearSelector()
  // onUpdateSelector()
  // onDisplaySelector()
  // onHideSelector()
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

  const updateSelectorValue = useCallback(() => {
    console.log('selector updated.');
  }, []);

  const fieldComponent = useField(field, value, updateValue);

  // @todo pass a lot of (optional) things from props to this selector status for actions on selectors.
  const selectorComponent = useSelectorStatus(field.selector, updateSelectorValue);

  // 1. user clicks on top right selector.
  // 2. user sees current status of the selector.
  // 3. user clicks edit/change selector.
  // 4. user confirms choice
  // 5. user closes top right selector (also saves)

  return (
    <div style={{ marginBottom: 30 }}>
      <FieldHeader2
        labelFor={field.id}
        label={field.label}
        description={field.description}
        selectorComponent={selectorComponent}
        showTerm={showTerm}
        term={term}
      />
      <div>{fieldComponent}</div>
    </div>
  );
};
