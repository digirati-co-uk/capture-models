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
import { createContext } from '@capture-models/helpers';
import { BaseContent } from '@capture-models/types';
import React, { Suspense, useEffect, useRef, useState } from 'react';
// import { Content } from '@capture-models/plugin-api';
import { useCurrentSelector, useDisplaySelectors, useSelectorActions } from '../../stores/selectors/selector-hooks';

export interface CanvasPanelProps extends BaseContent {
  id: string;
  type: string;
  state: {
    maxHeight?: number;
    canvasId: string;
    manifestId: string;
  };
}

export const [useViewer, ViewerProvider] = createContext<any>();

export const CanvasPanel: React.FC<CanvasPanelProps['state']> = ({ canvasId, manifestId, maxHeight }) => {
  const [viewer, setViewer] = useState<any>();
  // Starting with display selectors. I need the selector context, BUT it should
  // work without the context too.
  const currentSelector = useCurrentSelector('canvas-panel', {
    width: 400,
    height: 400,
    x: 500,
    y: 500,
  });

  const [displayIds, displaySelectors, topLevelSelectors] = useDisplaySelectors('canvas-panel');
  const [actions, availableSelectors] = useSelectorActions();
  // @todo useTopLevelSelector();

  useEffect(() => {
    // @todo UI to toggle these on and off and props to control this behaviour.
    if (actions && availableSelectors && displayIds && displayIds.length === 0) {
      const selectorIds = ((availableSelectors as any) || []).map((s: any) => s.id);
      if (selectorIds.length) {
        actions.addVisibleSelectorIds({
          selectorIds: selectorIds,
        });
      }
    }

    // @todo remove this, it's not right.
    // if (actions && !currentSelector && availableSelectors && availableSelectors[0]) {
    //   actions.chooseSelector({ selectorId: availableSelectors[0].id });
    // }

    // @todo set top level selector
    // @todo change viewport if top level selector is set and props to control
    // @todo cycle through available selectors and add preview state - cropped
    //     thumbnail, if available.
  }, [actions, availableSelectors, currentSelector, displayIds, displaySelectors]);

  return (
    <Suspense fallback={() => null}>
      <ViewerProvider value={viewer}>
        <Manifest url={manifestId}>
          <CanvasProvider startCanvas={canvasId || undefined}>
            <SingleTileSource>
              <Viewport maxHeight={maxHeight || window.innerHeight} setRef={setViewer}>
                <OpenSeadragonViewport viewportController={true}>
                  <OpenSeadragonViewer maxHeight={1000} />
                </OpenSeadragonViewport>
                <CanvasRepresentation ratio={1}>{displaySelectors}</CanvasRepresentation>
                <CanvasRepresentation ratio={1}>{topLevelSelectors}</CanvasRepresentation>
                <CanvasRepresentation ratio={1}>{currentSelector}</CanvasRepresentation>
              </Viewport>
            </SingleTileSource>
          </CanvasProvider>
        </Manifest>
      </ViewerProvider>
    </Suspense>
  );
};

const WrappedCanvasPanel: React.FC<CanvasPanelProps> = ({ id, state }) => {
  return <CanvasPanel key={id} {...state} />;
};

export default WrappedCanvasPanel;
