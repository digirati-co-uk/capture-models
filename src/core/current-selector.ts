import { CaptureModel } from '../types/capture-model';
import { Draft, original } from 'immer';
import { FieldTypes } from '../types/field-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectorTypes } from '../types/selector-types';
import { useContext } from './context';
import {
  CurrentSelectorState,
  UseCurrentSelector,
} from '../types/current-selector';

export function useCurrentSelector<
  Selector extends SelectorTypes = SelectorTypes
>(): UseCurrentSelector<Selector> {
  const {
    currentSelectorPath,
    currentSelector,
    setCurrentSelector,
    updateCustomSelector,
    currentSelectorOriginalState,
  } = useContext();

  const confirmSelector = useCallback(() => {
    // sets the current selector to null
    setCurrentSelector(null);
  }, [setCurrentSelector]);

  const updateSelector = useCallback(
    (state: SelectorTypes['state'], confirm: boolean = false) => {
      if (currentSelectorPath) {
        updateCustomSelector(currentSelectorPath, state);
        if (confirm) {
          confirmSelector();
        }
      }
    },
    [confirmSelector, currentSelectorPath, updateCustomSelector]
  );

  const resetSelector = useCallback(() => {
    // sets the selector to `currentSelectorOriginalState`
    updateSelector(currentSelectorOriginalState, true);
  }, [currentSelectorOriginalState, updateSelector]);

  return useMemo(
    () => ({
      currentSelectorPath,
      confirmSelector,
      currentSelector,
      currentSelectorOriginalState,
      resetSelector,
      setCurrentSelector,
      updateCustomSelector,
      updateSelector,
    }),
    [
      currentSelectorPath,
      confirmSelector,
      currentSelector,
      currentSelectorOriginalState,
      resetSelector,
      setCurrentSelector,
      updateCustomSelector,
      updateSelector,
    ]
  );
}

export function useInternalCurrentSelectorState(
  captureModel: CaptureModel,
  updateField: (
    path: Array<[string, number]>,
    cb: (field: Draft<FieldTypes>, draft: Draft<CaptureModel>) => void
  ) => void
): CurrentSelectorState {
  const [currentSelectorPath, setCurrentSelector] = useState<Array<
    [string, number]
  > | null>(null);

  const [
    currentSelectorOriginalState,
    setCurrentSelectorOriginalState,
  ] = useState<SelectorTypes['state']>(null);

  const [currentSelector, setCurrentSelectorObj] = useState();

  const fieldSelector = useMemo(() => {
    if (!currentSelectorPath) {
      return null;
    }
    return (currentSelectorPath.reduce(
      (acc: CaptureModel['document'], [path, idx]) => {
        return acc.properties[path][idx] as CaptureModel['document'];
      },
      captureModel.document
    ) as CaptureModel['document'] | FieldTypes).selector;
  }, [captureModel.document, currentSelectorPath]);

  useEffect(() => {
    setCurrentSelectorObj(fieldSelector ? fieldSelector.state : null);
  }, [fieldSelector]);

  useEffect(() => {
    if (currentSelectorPath && fieldSelector) {
      setCurrentSelectorOriginalState(
        fieldSelector ? fieldSelector.state : null
      );
    }
    // This shouldn't change if the document changes. The doc will
    // change quite often, but this only needs to track the original
    // state when the selector path changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelectorPath]);

  const updateCustomSelector = useCallback(
    <Selector extends SelectorTypes>(
      path: Array<[string, number]>,
      value: Selector['state']
    ) => {
      updateField(path, field => {
        if (field.selector) {
          field.selector.state = value;
        }
      });
      // Updates the capture model.
    },
    [updateField]
  );

  return {
    currentSelectorPath,
    currentSelector,
    currentSelectorOriginalState,
    updateCustomSelector,
    setCurrentSelector,
  };
}
