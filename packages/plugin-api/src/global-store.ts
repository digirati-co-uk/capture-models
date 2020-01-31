import {
  BaseContent,
  BaseField,
  BaseSelector,
  ContentSpecification,
  FieldSpecification,
  FieldTypeMap,
  SelectorSpecification,
} from '@capture-models/types';
import { pluginStore } from './globals';

export const resetPluginStore = () => {
  pluginStore.fields = {};
  pluginStore.contentTypes = {};
  pluginStore.selectors = {};
};

export function registerField<Props extends BaseField>(specification: FieldSpecification<Props>) {
  pluginStore.fields[specification.type] = specification as any;
}

export function registerContent<Props extends BaseContent>(contentType: ContentSpecification<Props>) {
  pluginStore.contentTypes[contentType.type] = contentType as any;
}

export function registerSelector<Props extends BaseSelector>(specification: SelectorSpecification<Props>) {
  pluginStore.selectors[specification.type] = specification as any;
}

export function getFieldPlugin<Props extends BaseField, TypeMap extends FieldTypeMap = FieldTypeMap>(
  type: string
): FieldSpecification<Props> {
  const field = pluginStore.fields[type];
  if (!field) {
    throw new Error(`Field type ${type} not found`);
  }

  return field as FieldSpecification<Props>;
}
