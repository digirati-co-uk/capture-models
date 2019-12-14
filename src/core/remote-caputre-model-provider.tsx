import React, { useState } from 'react';
import { CaptureModel } from '../types/capture-model';
import { useAsyncEffect } from 'use-async-effect';
import { fetchCaptureModel } from '../utility/fetch-capture-model';
import { CaptureModelProvider } from './capture-model-provider';

export const RemoteCaptureModelProvider: React.FC<{
  captureModelId: string;
  loadingState?: () => React.ReactElement;
}> = ({ captureModelId, loadingState, children }) => {
  const [captureModel, setCaptureModel] = useState<CaptureModel | undefined>();

  // load capture model if applicable.
  useAsyncEffect(async isMounted => {
    if (!captureModel) {
      const model = await fetchCaptureModel(captureModelId);
      if (!isMounted()) return;
      setCaptureModel(model);
    }
  }, []);

  // Return the loading state function (or null) while capture model is loading
  if (!captureModel) {
    return loadingState ? loadingState() : null;
  }

  return <CaptureModelProvider captureModel={captureModel} children={children} />;
};
