import React from 'react';
import { ContentSpecification } from '../../types/content-types';
import { registerContent } from '../../core/plugins';
import { CanvasPanelProps } from './CanvasPanel';

declare module '../../types/content-types' {
  export interface ContentTypeMap {
    'canvas-panel': CanvasPanelProps;
  }
}

const specification: ContentSpecification<CanvasPanelProps, 'canvas-panel'> = {
  label: 'Canvas Panel',
  type: 'canvas-panel',
  description: 'Supports viewing IIIF Canvases inside of a Manifest.',
  defaultState: {
    canvasId: '',
    manifestId: '',
  },
  DefaultComponent: React.lazy(() => import(/* webpackChunkName: "content" */ './CanvasPanel')),
};

registerContent(specification);

export default specification;
