import * as React from 'react';
import { Revisions as RevisionStore } from '../../stores/revisions';
import CanvasPanel from './CanvasPanel';
import './index';
const model = require('../../../../../fixtures/04-selectors/05-wunder-selector.json');

export default { title: 'Content Types|Canvas Panel' };

export const Simple: React.FC = () => {
  return (
    <RevisionStore.Provider
      initialData={{ captureModel: model, initialRevision: 'e801f905-5afc-4612-9e59-2b78cf407b9d' }}
    >
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
