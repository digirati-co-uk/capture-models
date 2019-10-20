import { UseCaptureModel } from '../types/capture-model';
import { useMemo } from 'react';
import { useContext } from './context';

export function useCaptureModel(): UseCaptureModel {
  const { captureModel } = useContext();
  return useMemo(() => ({ captureModel }), [captureModel]);
}
