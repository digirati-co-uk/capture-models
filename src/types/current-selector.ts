import { SelectorTypes } from './selector-types';

export type CurrentSelectorState<
  Selector extends SelectorTypes = SelectorTypes
> = {
  // @todo at the moment, the selectors are global to the capture model context.
  //   This could be changed however, with a new context specifically for selectors.
  //   This would require the context around the form too, which could complicate things.
  //   It would not change the core functionality: updateCustomSelector and availableSelectors.
  currentSelectorPath: Array<[string, number]> | null;
  currentSelector: Selector['state'] | null;
  currentSelectorOriginalState: Selector['state'] | null;
  setCurrentSelector: (selectorPath: Array<[string, number]> | null) => void;
  // @todo possibly reintroduce availableSelectors. Will contain available selectors for the
  //   content to display without being instantiated by the form to support UX cases. The information
  //   is still technically available, so not a huge issue.
  // availableSelectors: Array<{
  //   path: Array<[string, number]>;
  //   selector: SelectorTypes;
  // }>;
  updateCustomSelector: (
    path: Array<[string, number]>,
    state: SelectorTypes['state']
  ) => void;
};

export type UseCurrentSelector<
  Selector extends SelectorTypes = SelectorTypes
> = CurrentSelectorState & {
  updateSelector: (state: Selector['state'], confirm?: boolean) => void;
  confirmSelector: () => void;
  resetSelector: () => void;
};
