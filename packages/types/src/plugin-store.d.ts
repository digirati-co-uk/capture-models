import { FieldSpecification } from './field-types';
import { ContentSpecification } from './content-types';
import { SelectorSpecification } from './selector-types';

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
