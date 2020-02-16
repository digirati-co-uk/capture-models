import { FC } from 'react';
import { MapValues } from './utility';

interface BaseContent {
  // Identifier of the content
  id: string;

  // Type of content, used by selectors to indicate compatibility.
  type: string;

  // Any state attached to the content, such as fetched resources, defined
  // by each individual content type.
  state: any;
}

export interface ContentTypeMap {}

export type ContentTypes = MapValues<ContentTypeMap>;

export type ContentSpecification<T extends BaseContent = BaseContent> = {
  label: string;
  type: T['type'];
  description: string;
  defaultState: T['state'];
  // @todo in the future this could be used to switch between content @types.
  // supports: (t: any) => boolean;
  // This is a reference implementation of the view.
  DefaultComponent: FC<T>;
};
