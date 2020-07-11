import React from 'react';
import { registerContent } from '@capture-models/plugin-api';
import { AtlasViewerProps } from './Atlas';
import { ContentSpecification } from '@capture-models/types';

declare module '@capture-models/types' {
  export interface ContentTypeMap {
    atlas: AtlasViewerProps;
  }
}

const specification: ContentSpecification<AtlasViewerProps> = {
  label: 'Atlas Viewer',
  type: 'atlas',
  supports: target => {
    if (target.length < 2) {
      return false;
    }
    const canvas = target[target.length - 1];
    const manifest = target[target.length - 2];

    return manifest && manifest.type === 'manifest' && canvas && canvas.type === 'canvas';
  },
  targetToState: (target, options) => {
    if (options.targetOverride) {
      return options.targetOverride;
    }
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
  DefaultComponent: React.lazy(() => import(/* webpackChunkName: "atlas" */ './Atlas')),
};

registerContent(specification);

export default specification;
