import { SelectorSpecification } from '@capture-models/types';
import React from 'react';
import { BoxSelector, BoxSelectorProps } from './BoxSelector';
import { registerSelector } from '../../core/plugins';
import '../../content-types/CanvasPanel/index';

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
    'canvas-panel': React.lazy(() => import(/* webpackChunkName: "content" */ './BoxSelector.canvas-panel')),
  },
};

registerSelector(specification);

export default specification;
