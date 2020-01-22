import { UseCaptureModel } from '../types/capture-model';
import { useMemo } from 'react';
import { useContext } from './context';

export function useCaptureModel(): UseCaptureModel {
  return useContext();
}
