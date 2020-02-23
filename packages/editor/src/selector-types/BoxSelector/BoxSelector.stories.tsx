import React, { useState } from 'react';
import BoxSelectorCanvasPanel from './BoxSelector.canvas-panel';
import {
  CanvasProvider,
  CanvasRepresentation,
  Manifest,
  OpenSeadragonViewer,
  OpenSeadragonViewport,
  SingleTileSource,
  Viewport,
  // @ts-ignore
} from '@canvas-panel/core';

export default { title: 'Selectors|Box Selector' };

export const CanvasPanelExample: React.FC = () => {
  const [selector, setSelector] = useState({ height: 388, width: 800, x: 843, y: 1173 });
  return (
    <div style={{ background: 'grey', position: 'relative', userSelect: 'none' }}>
      <Manifest url="https://wellcomelibrary.org/iiif/b18035723/manifest">
        <CanvasProvider>
          <SingleTileSource>
            <Viewport maxHeight={600}>
              <OpenSeadragonViewport viewportController={true}>
                <OpenSeadragonViewer maxHeight={1000} />
              </OpenSeadragonViewport>
              <CanvasRepresentation ratio={1}>
                <BoxSelectorCanvasPanel
                  id="abc-123"
                  type="box-selector"
                  state={selector}
                  updateSelector={(s: any) => {
                    console.log(s);
                    setSelector(s);
                  }}
                />
              </CanvasRepresentation>
            </Viewport>
          </SingleTileSource>
        </CanvasProvider>
      </Manifest>
    </div>
  );
};