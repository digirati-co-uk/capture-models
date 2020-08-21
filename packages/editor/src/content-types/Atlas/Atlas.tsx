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
import { AtlasAuto } from '@atlas-viewer/atlas';
import { ImageServiceContext } from './Atlas.helpers';

export interface AtlasViewerProps extends BaseContent {
  id: string;
  type: string;
  state: {
    canvasId: string;
    manifestId: string;
    imageService?: string;
  };
}

const Canvas: React.FC<{ isEditing?: boolean; onDeselect?: () => void }> = ({ isEditing, onDeselect, children }) => {
  const canvas = useCanvas();
  const { data: service } = useImageService() as { data?: ImageService };

  if (!service || !canvas) {
    return null;
  }

  return (
    <AtlasAuto mode={isEditing ? 'sketch' : 'explore'}>
      <world onClick={onDeselect}>
        <ImageServiceContext value={service}>
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
        <Suspense fallback={null}>{children}</Suspense>
        </ImageServiceContext>
      </world>
    </AtlasAuto>
  );
};

export const AtlasViewer: React.FC<AtlasViewerProps> = props => {
  const { isLoaded } = useExternalManifest(props.state.manifestId);
  const currentSelector = useCurrentSelector('atlas', undefined);
  const [displayIds, displaySelectors, topLevelSelectors, adjacentSelectors] = useDisplaySelectors('atlas');
  const [actions, availableSelectors] = useSelectorActions();

  // useEffect(() => {
  //   // @todo UI to toggle these on and off and props to control this behaviour.
  //   // if (actions && availableSelectors && displayIds && displayIds.length === 0) {
  //   //   const selectorIds = ((availableSelectors as any) || []).map((s: any) => s.id);
  //   //   if (selectorIds.length) {
  //   //     actions.addVisibleSelectorIds({
  //   //       selectorIds: selectorIds,
  //   //     });
  //   //   }
  //   // }
  // }, [actions, availableSelectors, currentSelector, displayIds, displaySelectors]);

  if (!isLoaded) {
    return <>loading manifest...</>;
  }

  const { height = 500, width = '100%', maxHeight, maxWidth } = props.options || { height: 500 };

  const styleProps = {
    minWidth: 100,
    minHeight: 100,
    height,
    width,
    maxHeight,
    maxWidth,
  };

  return (
    <div style={styleProps}>
      <CanvasContext canvas={props.state.canvasId}>
        <Canvas
          isEditing={!!currentSelector}
          onDeselect={() => {
            if (currentSelector) {
              actions.clearSelector();
            }
          }}
        >
          {adjacentSelectors}
          {topLevelSelectors}
          {displaySelectors}
          {currentSelector}
        </Canvas>
      </CanvasContext>
    </div>
  );
};

const WrappedViewer: React.FC<AtlasViewerProps> = props => {
  const customFetcher =
    props.options && props.options.custom && props.options.custom.customFetcher
      ? props.options.custom.customFetcher
      : undefined;

  return (
    <VaultProvider vaultOptions={customFetcher ? ({ customFetcher } as any) : undefined}>
      <AtlasViewer {...props}>{props.children}</AtlasViewer>
    </VaultProvider>
  );
};

export default WrappedViewer;
