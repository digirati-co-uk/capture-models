import { SelectorSpecification } from '@capture-models/types';
import React from 'react';
import { BoxSelector, BoxSelectorProps } from './BoxSelector';
import { registerSelector } from '@capture-models/plugin-api';
// import '../../content-types/CanvasPanel/index';
// import BoxSelectorCanvasPanel from './BoxSelector.canvas-panel';

declare module '@capture-models/types' {
  export interface SelectorTypeMap {
    'box-selector': BoxSelectorProps;
  }
}

const specification: SelectorSpecification<BoxSelectorProps, 'canvas-panel' | 'atlas'> = {
  label: 'Box Selector',
  type: 'box-selector',
  description: 'Supports selecting a region of a IIIF image.',
  FormComponent: BoxSelector,
  defaultState: null,
  supportedContentTypes: ['canvas-panel', 'atlas'],
  contentComponents: {
    'canvas-panel': React.lazy(() => import(/* webpackChunkName: "canvas-panel" */ './BoxSelector.canvas-panel')),
    atlas: React.lazy(() => import(/* webpackChunkName: "atlas" */ './BoxSelector.atlas')),
    // 'canvas-panel': BoxSelectorCanvasPanel,
  },
};

registerSelector(specification);

export default specification;
