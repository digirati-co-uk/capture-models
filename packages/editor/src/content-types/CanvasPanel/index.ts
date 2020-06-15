import React from 'react';
import { registerContent } from '@capture-models/plugin-api';
import { CanvasPanelProps } from './CanvasPanel';
import { ContentSpecification } from '@capture-models/types';

declare module '@capture-models/types' {
  export interface ContentTypeMap {
    'canvas-panel': CanvasPanelProps;
  }
}

/**
 * Supports:
 *     [
 *       { type: 'manifest', id: '...' },
 *       { type: 'canvas', id: '...' }
 *     ]
 *
 * or:
 *     [
 *       { type: 'anything', id: '...' },
 *       { type: 'manifest', id: '...' },
 *       { type: 'canvas', id: '...' }
 *     ]
 *
 *  So long as the last 2 items are a manifest and then a canvas (most specific)
 */
const specification: ContentSpecification<CanvasPanelProps> = {
  label: 'Canvas Panel',
  type: 'canvas-panel',
  supports: target => {
    if (target.length < 2) {
      return false;
    }
    const canvas = target[target.length - 1];
    const manifest = target[target.length - 2];

    return manifest && manifest.type === 'manifest' && canvas && canvas.type === 'canvas';
  },
  targetToState: target => {
    const canvas = target[target.length - 1];
    const manifest = target[target.length - 2];
    return {
      manifestId: manifest.id,
      canvasId: canvas.id,
    };
  },
  description: 'Supports viewing IIIF Canvases inside of a Manifest.',
  defaultState: {
    canvasId: '',
    manifestId: '',
  },
  DefaultComponent: React.lazy(() => import(/* webpackChunkName: "content" */ './CanvasPanel')),
  // DefaultComponent: CanvasPanel,
};

registerContent(specification);

export default specification;
