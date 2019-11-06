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
  //   is still technically available, so not a huge issue. This will possibly used to show regions
  //   on an image or document that have existing selectors, supporting the UX experience where
  //   you can click on a selector and be taken to a field. This should really work in hand with
  //   the current form shown. Will get more complex with nested models.
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
