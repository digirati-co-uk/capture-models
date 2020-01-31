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
import { BaseContent } from '@capture-models/types';
import React, { Suspense, useEffect } from 'react';
import { Content } from '../../core/plugins';
import { useCurrentSelector, useDisplaySelectors, useSelectorActions } from '../../stores/selectors/selector-hooks';

export interface CanvasPanelProps extends BaseContent {
  id: string;
  type: string;
  state: {
    canvasId: string;
    manifestId: string;
  };
}

export const CanvasPanel: React.FC<CanvasPanelProps['state']> = ({ canvasId, manifestId }) => {
  // Starting with display selectors. I need the selector context, BUT it should
  // work without the context too.
  const currentSelector = useCurrentSelector('canvas-panel');
  const displaySelectors = useDisplaySelectors('canvas-panel');
  const [actions, availableSelectors] = useSelectorActions();
  // @todo useTopLevelSelector();

  useEffect(() => {
    // @todo UI to toggle these on and off and props to control this behaviour.
    if (actions && availableSelectors && displaySelectors && displaySelectors.length === 0) {
      actions.addVisibleSelectorIds({
        selectorIds: ((availableSelectors as any) || []).map((s: any) => s.id),
      });
    }

    if (actions && !currentSelector && availableSelectors) {
      actions.chooseSelector({ selectorId: availableSelectors[0].id });
    }

    // @todo set top level selector
    // @todo change viewport if top level selector is set and props to control
    // @todo cycle through available selectors and add preview state - cropped
    //     thumbnail, if available.
  }, [actions, availableSelectors, currentSelector, displaySelectors]);

  return (
    <Suspense fallback={() => null}>
      <Manifest url={manifestId}>
        <CanvasProvider canvasId={canvasId}>
          <SingleTileSource>
            <Viewport maxHeight={600}>
              <OpenSeadragonViewport viewportController={true}>
                <OpenSeadragonViewer maxHeight={1000} />
              </OpenSeadragonViewport>
              <CanvasRepresentation ratio={1}>{displaySelectors}</CanvasRepresentation>
              <CanvasRepresentation ratio={1}>{currentSelector}</CanvasRepresentation>
            </Viewport>
          </SingleTileSource>
        </CanvasProvider>
      </Manifest>
    </Suspense>
  );
};

const WrappedCanvasPanel: React.FC<CanvasPanelProps> = ({ id, state }) => {
  return (
    <Content type="canvas-panel" state={state}>
      <CanvasPanel key={id} {...state} />;
    </Content>
  );
};

export default WrappedCanvasPanel;
