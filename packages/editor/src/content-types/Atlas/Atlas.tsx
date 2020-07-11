import { ImageService } from '@hyperion-framework/types';
import React, { useEffect, Suspense } from 'react';
import { BaseContent } from '@capture-models/types';
import { useCurrentSelector, useDisplaySelectors, useSelectorActions } from '../../stores/selectors/selector-hooks';
import {
  useExternalManifest,
  CanvasContext,
  useCanvas,
  useImageService,
  VaultProvider,
} from '@hyperion-framework/react-vault';
import { Atlas } from '@atlas-viewer/atlas';

export interface AtlasViewerProps extends BaseContent {
  id: string;
  type: string;
  state: {
    canvasId: string;
    manifestId: string;
    imageService?: string;
  };
}

function useSafeImageService() {
  try {
    return useImageService();
  } catch (e) {
    return { data: undefined };
  }
}

const Canvas: React.FC<{ isEditing?: boolean }> = ({ isEditing, children }) => {
  const canvas = useCanvas();
  const { data: service } = useSafeImageService() as { data?: ImageService };

  if (!service || !canvas) {
    return null;
  }

  // <Atlas /> - is the viewer.
  //            Under this component you can use some custom components provided by the library
  //            These are not import, they are native elements (like div, a in React DOM)

  // <worldObject /> - this matches with the concept of a Canvas in IIIF it can contain
  //                   one or more images.

  // <compositeImage /> - A special type of image that will selectively render images under it
  //                      at different scales. So you can have the same image at 3 scales under
  //                      and it will swap them out depending on the viewport.

  // <tiledImage /> - This is an image made up of tiles, using the IIIF Image API specification.
  //                  You provide a service ID, a tile and scale factor, along with the size of
  //                  the image it's representing (the canvas in this case).

  // What the code below is saying is:
  // - Render this canvas at the size of the canvas.
  // - Add a single composite image
  // - To that composite image, add all of the tiles at the available scales
  // - Only render the scale that best fits the current zoom (composite image)

  return (
    <div>
      <Atlas width={800} height={600} mode={isEditing ? 'sketch' : 'explore'}>
        <world>
          <worldObject height={canvas.height} width={canvas.width} x={0} y={0}>
            <compositeImage key={service.id} width={canvas.width} height={canvas.height}>
              {(service.tiles || []).map(tile =>
                (tile.scaleFactors || []).map(size => (
                  <tiledImage
                    key={`${tile}-${size}`}
                    uri={service.id}
                    display={{ width: canvas.width, height: canvas.height }}
                    tile={tile}
                    scaleFactor={size}
                  />
                ))
              )}
            </compositeImage>
          </worldObject>
          <Suspense fallback={() => null}>{children}</Suspense>
        </world>
      </Atlas>
    </div>
  );
};

export const AtlasViewer: React.FC<AtlasViewerProps> = props => {
  const { isLoaded } = useExternalManifest(props.state.manifestId);
  const currentSelector = useCurrentSelector('atlas', undefined);
  const [displayIds, displaySelectors, topLevelSelectors] = useDisplaySelectors('atlas');
  const [actions, availableSelectors] = useSelectorActions();

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

  if (!isLoaded) {
    return <>loading...</>;
  }

  return (
    <CanvasContext canvas={props.state.canvasId}>
      <Canvas isEditing={!!currentSelector}>
        {displaySelectors}
        {topLevelSelectors}
        {currentSelector}
      </Canvas>
    </CanvasContext>
  );
};

const WrappedViewer: React.FC<AtlasViewerProps> = props => {
  const customFetcher =
    props.options.custom && props.options.custom.customFetcher ? props.options.custom.customFetcher : undefined;

  return (
    <VaultProvider vaultOptions={{ customFetcher } as any}>
      <AtlasViewer {...props}>{props.children}</AtlasViewer>
    </VaultProvider>
  );
};

export default WrappedViewer;
