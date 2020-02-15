import * as React from 'react';
import { RevisionStore } from '../../stores/revisions/revisions-store';
import CanvasPanel from './CanvasPanel';
import './index';
const model = require('../../../../../fixtures/04-selectors/05-wunder-selector.json');

export default { title: 'Content Types|Canvas Panel' };

export const Simple: React.FC = () => {
  return (
    <RevisionStore.Provider initialData={{ captureModel: model, initialRevision: 'c2' }}>
      <CanvasPanel
        id="123"
        type="canvas-panel"
        state={{
          canvasId: 'https://wellcomelibrary.org/iiif/b18035723/canvas/c0',
          manifestId: 'https://wellcomelibrary.org/iiif/b18035723/manifest',
        }}
      />
    </RevisionStore.Provider>
  );
};
