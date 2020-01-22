import React from 'react';
import { MapValues } from './utility';

// There will be something here.
export type BaseSelector = {
  id: string;
};

export interface SelectorTypeMap {}

export interface SelectorContentTypeMap {}

export type InjectedSelectorProps<T> = {
  // @todo I think these are where we need to expand for the recent store changes.
  //   These are all of the actions that both the form AND the content versions of the
  //   components have. List of all of them here:
  //    - chooseSelector: Action<RevisionsModel, { selectorId: string }>;
  //    - clearSelector: Action<RevisionsModel>;
  //    - updateSelector: Action<RevisionsModel, { selectorId: string; state: SelectorTypes['state'] }>;
  //    - updateSelectorPreview: Action<RevisionsModel, { selectorId: string; preview: any }>;
  //    - setTopLevelSelector: Action<RevisionsModel, { selectorId: string }>;
  //    - clearTopLevelSelector: Action<RevisionsModel>;
  //    - addVisibleSelectorIds: Action<RevisionsModel, { selectorIds: string[] }>;
  //    - removeVisibleSelectorIds: Action<RevisionsModel, { selectorIds: string[] }>;
  //   However the exact needs are not going to be clear without a UI to attach these to and test.
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
