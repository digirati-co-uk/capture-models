import React from 'react';
import { MapValues } from './utility';

// There will be something here.
export type BaseSelector = {
  id: string;
};

export interface SelectorTypeMap {}

export interface SelectorContentTypeMap {}

export type InjectedSelectorProps<T> = {
  updateSelector(state: T): void;
};

export type SelectorTypes = MapValues<SelectorTypeMap, BaseSelector>;

export type SelectorContentTypes = MapValues<SelectorContentTypeMap>;

// Injected properties.
export type SelectorTypeProps<T extends { state: State }, State = T['state']> = T & InjectedSelectorProps<T['state']>;

export type SelectorComponent<T extends { state: State }, State = T['state']> = React.FC<SelectorTypeProps<T, State>>;

export type SelectorSpecification<
  T extends SelectorTypeMap[Type],
  Type extends keyof SelectorTypeMap,
  CT extends keyof SelectorContentTypeMap
> = {
  label: string;
  type: T['type'];
  description: string;
  supportedContentTypes: Array<CT>;
  defaultState: T['state'];
  FormComponent: React.FC<T & InjectedSelectorProps<T['state']>>;
  contentComponents: {
    [contentType in CT]: React.FC<T & InjectedSelectorProps<T['state']>>;
  };
  Editor?: React.FC<Required<Omit<T, 'state'>>>;
};
