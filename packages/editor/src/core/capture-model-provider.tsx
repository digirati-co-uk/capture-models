import React, { useMemo, useState } from 'react';
import { useInternalNavigationState } from './navigation';
import { useInternalCurrentFormState } from './current-form';
import { useInternalCurrentSelectorState } from './current-selector';
import { InternalProvider } from './context';
import { CaptureModel, CaptureModelContext } from '@capture-models/types';

export const CaptureModelProvider: React.FC<{
  captureModel: CaptureModel;
}> = ({ captureModel: originalCaptureModel, children }) => {
  const [captureModel, setCaptureModel] = useState<CaptureModel>(() => originalCaptureModel);

  const { currentView, currentPath, replacePath } = useInternalNavigationState(captureModel);

  const {
    currentFields,
    updateFieldValue,
    createUpdateFieldValue,
    updateInternalFieldValue,
  } = useInternalCurrentFormState(
    captureModel,
    setCaptureModel,
    currentView.type === 'model' ? currentView.fields : null
  );

  const {
    currentSelectorPath,
    currentSelector,
    currentSelectorOriginalState,
    setCurrentSelector,
    updateCustomSelector,
  } = useInternalCurrentSelectorState(captureModel, updateInternalFieldValue);

  const state: CaptureModelContext = useMemo(
    () => ({
      captureModel,
      currentView,
      currentPath,
      replacePath,
      currentFields,
      updateFieldValue,
      createUpdateFieldValue,
      currentSelectorPath,
      currentSelector,
      currentSelectorOriginalState,
      setCurrentSelector,
      updateCustomSelector,
    }),
    [
      captureModel,
      createUpdateFieldValue,
      currentFields,
      currentPath,
      currentSelector,
      currentSelectorOriginalState,
      currentSelectorPath,
      currentView,
      // @todo, these probably shouldn't need to be in here.
      replacePath,
      setCurrentSelector,
      updateCustomSelector,
      updateFieldValue,
    ]
  );

  return <InternalProvider value={state} children={children} />;
};
