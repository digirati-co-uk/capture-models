import React, { useCallback, useState } from 'react';
import { useField, useSelectorStatus } from '@capture-models/plugin-api';
import { FieldHeaderComponent } from '../FieldHeader/FieldHeader-component';
import { BaseField, BaseSelector } from '@capture-models/types';

type Props<T extends BaseField = BaseField> = {
  field: T;
  selector?: BaseSelector;
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

export const FieldWrapper: React.FC<Props> = ({ field, term, onUpdateValue, showTerm, selector }) => {
  const [value, setValue] = useState(field.value);

  const updateValue = useCallback(
    newValue => {
      setValue(newValue);
      onUpdateValue(newValue);
    },
    [onUpdateValue]
  );

  const updateSelectorValue = useCallback(() => {
    // console.log('selector updated.');
  }, []);

  const fieldComponent = useField(field, value, updateValue);

  // @todo pass a lot of (optional) things from props to this selector status for actions on selectors.
  const selectorComponent = useSelectorStatus(selector, updateSelectorValue);

  // 1. user clicks on top right selector.
  // 2. user sees current status of the selector.
  // 3. user clicks edit/change selector.
  // 4. user confirms choice
  // 5. user closes top right selector (also saves)

  return (
    <div style={{ marginBottom: 30 }}>
      <FieldHeaderComponent
        labelFor={field.id}
        label={field.label}
        description={field.description}
        selectorComponent={selectorComponent}
        showTerm={showTerm}
        term={term}
      />
      <div>{fieldComponent || ''}</div>
    </div>
  );
};
