import { SelectorSpecification } from '@capture-models/types';
import React from 'react';
import { BoxSelector, BoxSelectorProps } from './BoxSelector';
import { registerSelector } from '@capture-models/plugin-api';
import '../../content-types/CanvasPanel/index';
import BoxSelectorCanvasPanel from './BoxSelector.canvas-panel';

declare module '@capture-models/types' {
  export interface SelectorTypeMap {
    'box-selector': BoxSelectorProps;
  }
}

const specification: SelectorSpecification<BoxSelectorProps, 'canvas-panel'> = {
  label: 'Box Selector',
  type: 'box-selector',
  description: 'Supports selecting a region of a IIIF image.',
  FormComponent: BoxSelector,
  defaultState: null,
  supportedContentTypes: ['canvas-panel'],
  contentComponents: {
    // 'canvas-panel': React.lazy(() => import(/* webpackChunkName: "content" */ './BoxSelector.canvas-panel')),
    'canvas-panel': BoxSelectorCanvasPanel,
  },
};

registerSelector(specification);

export default specification;
