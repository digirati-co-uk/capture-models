import React from 'react';
import { MapValues } from './utility';

interface BaseContent {
  // Identifier of the content
  id: string;

  // Type of content, used by selectors to indicate compatibility.
  type: string;

  // Any state attached to the content, such as fetched resources, defined
  // by each individual content type.
  // state: any;
}

export interface ContentTypeMap {}

export type ContentTypes = MapValues<ContentTypeMap>;

export type ContentSpecification<T extends ContentTypeMap[Type], Type extends keyof ContentTypeMap> = {
  label: string;
  type: T['type'];
  description: string;
  defaultState: T['state'];
  // @todo in the future this could be used to switch between content types.
  // supports: (t: any) => boolean;
  // This is a reference implementation of the view.
  DefaultComponent: React.FC<T>;
};

// How will the API for this work.
//
// The first step is setting the context of the content.
// <Content type="canvas-panel" state={{ thumbnail: '...', ... }}> ... </Content>
//
// This will let the hooks know which components to serve when you are displaying
// various selectors.
//
// => First the current active selector.
// The actions here will be for updating the selector, its state and preview.
// Also for removing it as the active selector.
//
// const = [ Component, actions ] = useContentSelector();
//
//
// => Display selectors next.
// These are optionally to be displayed on the content. They have some actions
// that can be applied.
// @todo new content-type display selector OR editing parameter passed to current.
//
// const [ Array<[Component, actions]> ] = useContentDisplaySelectors();
//
// The actions will also let you:
// - select/highlight attached field + select selector
// - show/hide individual selectors
//
//
// => Finally, the top level selector.
// This is the outermost and least specific selector on the current form. For example, a form
// may be a paragraph level box with fields for each line (and boxes for each
// line). This top level selector allows the content to focus in on a region
// where the work is being done (e.g. the paragraph in a viewer).
// @todo new prop for display OR editing to indicate top level selector.
// @todo what happens if the top level selector is edited?
// const [ Component, state, actions ] = useTopLevelSelector();
//
// NOTE: Instead of passing `content-type-id` we will have a static context.
