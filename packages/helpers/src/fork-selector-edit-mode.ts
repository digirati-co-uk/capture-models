import { BaseSelector } from '@capture-models/types';
import { generateId } from './generate-id';

export function forkSelectorEditMode(selector: BaseSelector, revisionId: string, state: any) {
  return {
    ...selector,
    id: generateId(),
    revisionId: revisionId,
    revises: selector.id,
    state: state,
  };
}
