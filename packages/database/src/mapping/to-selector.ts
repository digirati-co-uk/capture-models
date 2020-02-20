import { BaseSelector } from '../../../types/src/selector-types';
import { SelectorInstance } from '../entity/SelectorInstance';

export function toSelector({ configuration, type, state, id }: SelectorInstance): BaseSelector {
  return {
    id,
    type,
    state,
    ...configuration,
  };
}
