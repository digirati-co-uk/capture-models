import { BaseSelector } from '@capture-models/types';
import { SelectorInstance } from '../entity/SelectorInstance';

export function fromSelector({ id, state, type, ...additional }: BaseSelector): SelectorInstance {
  // @ts-ignore
  const { version, ...configuration } = additional;
  const selector = new SelectorInstance();
  selector.id = id;
  selector.state = state;
  selector.type = type;
  selector.configuration = configuration;

  return selector;
}
