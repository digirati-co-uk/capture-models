import { UseCaptureModel } from '../types/capture-model';
import { useContext } from './context';

export function useCaptureModel(): UseCaptureModel {
  return useContext();
}
