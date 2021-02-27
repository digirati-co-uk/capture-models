import { BaseSelector } from '@capture-models/types';

export function resolveSelector(selector: BaseSelector, revisionId?: string): BaseSelector {
  if (selector.revisedBy && revisionId) {
    for (const revisedSelector of selector.revisedBy) {
      if (revisedSelector.revisionId === revisionId) {
        return {
          ...selector,
          state: revisedSelector.state,
        };
      }
    }
  }
  return selector;
}
