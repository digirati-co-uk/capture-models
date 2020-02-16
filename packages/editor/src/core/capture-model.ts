import { UseCaptureModel } from '@capture-models/types';
import { useContext } from './context';

/**
 * @deprecated
 */
export function useCaptureModel(): UseCaptureModel {
  return useContext();
}
