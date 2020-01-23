import React from 'react';
import { SelectorSpecification } from '../../types/selector-types';
import { BoxSelector, BoxSelectorProps } from './BoxSelector';
import { registerSelector } from '../../core/plugins';
import '../../content-types/CanvasPanel';

declare module '../../types/selector-types' {
  export interface SelectorTypeMap {
    'box-selector': BoxSelectorProps;
  }
}

const specification: SelectorSpecification<BoxSelectorProps, 'box-selector', 'canvas-panel'> = {
  label: 'Box Selector',
  type: 'box-selector',
  description: 'Supports selecting a region of a IIIF image.',
  FormComponent: BoxSelector,
  defaultState: null,
  supportedContentTypes: ['canvas-panel'],
  contentComponents: {
    'canvas-panel': React.lazy(() => import(/* webpackChunkName: "content" */ './BoxSelector.canvas-panel')),
  },
};

registerSelector(specification);

export default specification;
