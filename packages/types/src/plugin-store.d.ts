import { FieldSpecification, FieldTypeMap } from './field-types';
import { ContentSpecification, ContentTypeMap } from './content-types';
import { SelectorSpecification, SelectorTypeMap } from './selector-types';

export type PluginStore = {
  fields: {
    [key in string]?: FieldSpecification;
  };
  contentTypes: {
    [key in string]?: ContentSpecification;
  };
  selectors: {
    [key in string]?: SelectorSpecification;
  };
};
