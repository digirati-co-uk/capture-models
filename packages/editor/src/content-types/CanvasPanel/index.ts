import React from 'react';
import { registerContent } from '../../core/plugins';
import { CanvasPanelProps } from './CanvasPanel';
import { ContentSpecification } from '@capture-models/types';

declare module '@capture-models/types' {
  export interface ContentTypeMap {
    'canvas-panel': CanvasPanelProps;
  }
}

const specification: ContentSpecification<CanvasPanelProps> = {
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
