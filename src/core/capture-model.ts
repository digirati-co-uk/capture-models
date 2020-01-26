import { UseCaptureModel } from '../types/capture-model';
import { useContext } from './context';

/**
 * @deprecated
 */
export function useCaptureModel(): UseCaptureModel {
  return useContext();
}
