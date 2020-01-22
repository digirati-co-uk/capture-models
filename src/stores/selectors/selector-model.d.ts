import { SelectorTypes } from '../../types/selector-types';

// @todo A selector needs to be rendered in two places.
//    - On the content, using a content-specific plugin
//    - On the form, showing the state of it
//   On the from we need to decide what information we will
//   show about the selector. Will it just be a lifecycle of
//   the selector (choose, chosen, change, discard etc.) or will
//   it also show a preview of the content in its refined state.
//   For example, a text selector may show a the snippet of text,
//   or an image show the cropped image.
//   How would this vary between content, should the be up to the
//   rendering component to just understand? How does the content-
//   specific side of the component relay this preview-state?
//   Selector state machine required.
//    - opening/closing selector on form (local)
//    - choosing to edit selector
//    - updating state of selector
//    - updating selector preview data
//    - deselecting selector on form
//    - highlighting selector? (hover on form?)
//    - Automatically changing view based on outer most selector in revision
//    - Displaying revisions nested selectors
//    - clicking displayed selector and highlighting form field
//   Also need to add some missing elements to the form editor:
//    - choosing a selector
//    - configuring its form (if any)
//    - Saving to the main model

// This is a small wrapper around the selector in order to have enough information about it to send update notifications
// to an outer store that may be considered a source of truth. In general, this store is the only place where
// selectors should be changed.
// This was not readily available, but it might be needed later.
// type SelectorItem = {
//   selector: SelectorTypes;
//   path: Array<[string, string]>;
// };

// Note: It's not yet clear when this store will be created. It's likely to be created when the form is active, but that
// may not be right. It may make sense for this to be scoped globally on the capture model document OR on a single
// subset. However, that will not change this model definition, just how the document is created (as revisions are
// documents too, just a subset).
export type SelectorModel = {
  // This is a list of all of the available selectors that are in whatever is currently being edited. This can be
  // used to toggle on all to be visible, or some by whatever is querying the state.
  availableSelectors: SelectorTypes[];

  // We'll use IDs for selectors too, like the others. These need to be unique however, since in a full document
  // editing mode you may come across more than one. Full document editing mode may have to change these IDs during
  // the import or mapping to include revision prefix or similar.
  // This is current selector that is visible on the content.
  currentSelectorId: string | null;

  // The top level selector or the outer-most selector is the least specific selector on the resource. This could
  // be a cropped image, or a page in a book. It can be used in the UI to focus the work a subset of the resource. It's
  // also going to be used to present the model with some basic navigation.
  topLevelSelector: string | null;

  // This is another set of selectors that are visible on the content but not editable. Whatever is displaying
  // these on the content could decide to also make it so when you click on one it selects the field.
  visibleSelectorIds: string[];

  // This is the state of the current selector. It may have to be changed to be an any type since it can be any
  // selector state that is available and this has been unreliable for setting in the past.
  currentSelectorState: SelectorTypes['state'];

  // This may get a type at some point, but it is completely up to the plugin to decide what the shape of this is.
  // If a plugin wants to put an Image URL or text in here, that's fine, since the plugin will simply be passed this
  // in order to render it. It's not something that always exists, but it is something that an active selector can
  // choose to populate (on mount or on change I suppose.)
  selectorPreviewData: {
    [id: string]: any;
  };
};
