import { BaseSelector } from '@capture-models/types';
import { SelectorInstance } from '../entity/SelectorInstance';

export function fromSelector({ id, state, type, ...additional }: BaseSelector): SelectorInstance {
  const selector = new SelectorInstance();
  selector.id = id;
  selector.state = state;
  selector.type = type;
  selector.configuration = additional;

  return selector;
}
