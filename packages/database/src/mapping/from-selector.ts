import { BaseSelector } from '@capture-models/types';
import { SelectorInstance } from '../entity/SelectorInstance';

export function fromSelector(inputSelector: BaseSelector, parent?: BaseSelector): SelectorInstance {
  const { id, state, type, revisionId, revisedBy, revises, ...additional } = inputSelector;
  // @ts-ignore
  const { version, ...configuration } = additional;
  const selector = new SelectorInstance();
  selector.id = id;
  selector.state = state;
  selector.type = type;
  selector.configuration = configuration;
  selector.revisesId = revises;
  selector.revisionId = revisionId;
  if (revisedBy) {
    selector.revisedBy = Promise.resolve(
      revisedBy.map(revisedSelector => fromSelector(revisedSelector, inputSelector))
    );
  }
  if (parent) {
    selector.revisesId = parent.id;
  }

  return selector;
}
