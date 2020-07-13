import React, { useCallback, useEffect, useState } from 'react';
import { useField, useSelectorStatus } from '@capture-models/plugin-api';
import { FieldHeader } from '../FieldHeader/FieldHeader';
import { BaseField, BaseSelector } from '@capture-models/types';

type Props<T extends BaseField = BaseField> = {
  field: T;
  selector?: BaseSelector;
  term?: string;
  showTerm?: boolean;
  onUpdateValue: (value: T['value']) => void;
  hideHeader?: boolean;
  fallback?: any;
  chooseSelector?: (payload: { selectorId: string }) => void;
  currentSelectorId?: string | null;
  clearSelector?: () => void;

  // @todo other things for the selector.
  // onChooseSelector()
  // onClearSelector()
  // onUpdateSelector()
  // onDisplaySelector()
  // onHideSelector()
};

export const FieldWrapper: React.FC<Props> = ({
  field,
  term,
  onUpdateValue,
  showTerm,
  selector,
  hideHeader,
  fallback,
  chooseSelector,
  currentSelectorId,
  clearSelector,
}) => {
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
  const selectorComponent = useSelectorStatus(selector, {
    updateSelector: updateSelectorValue,
    chooseSelector: chooseSelector ? (selectorId: string) => chooseSelector({ selectorId }) : undefined,
    clearSelector,
    currentSelectorId: currentSelectorId ? currentSelectorId : undefined,
  });

  const componentWillUnmount = useCallback(() => {
    if (selector && clearSelector && currentSelectorId === selector.id) {
      clearSelector();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectorId]);

  // 1. user clicks on top right selector.
  // 2. user sees current status of the selector.
  // 3. user clicks edit/change selector.
  // 4. user confirms choice
  // 5. user closes top right selector (also saves)

  // On unmount.
  useEffect(() => componentWillUnmount, [componentWillUnmount]);

  return (
    <React.Suspense fallback={() => (typeof fallback !== 'undefined' ? fallback : 'loading...')}>
      <div style={{ marginBottom: 30 }}>
        {hideHeader ? null : (
          <FieldHeader
            labelFor={field.id}
            label={field.label}
            description={field.description}
            selectorComponent={selectorComponent}
            showTerm={showTerm}
            onSelectorOpen={() => {
              if (chooseSelector && selector) {
                chooseSelector({ selectorId: selector.id });
              }
            }}
            onSelectorClose={clearSelector}
            term={term}
          />
        )}
        <div>{fieldComponent || ''}</div>
      </div>
    </React.Suspense>
  );
};
