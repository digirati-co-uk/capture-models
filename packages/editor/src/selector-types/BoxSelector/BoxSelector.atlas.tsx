import { SelectorComponent } from '@capture-models/types';
import React, { useEffect } from 'react';
import { useCroppedRegion } from '../../content-types/Atlas/Atlas.helpers';
import { BoxSelectorProps } from './BoxSelector';
import { DrawBox, RegionHighlight } from '@atlas-viewer/atlas';

const BoxSelectorAtlas: SelectorComponent<BoxSelectorProps> = props => {
  const { state, readOnly, updateSelector, updateSelectorPreview, id, isAdjacent, isTopLevel, onClick } = props;
  const generatePreview = useCroppedRegion();

  useEffect(() => {
    if (updateSelectorPreview && state) {
      const preview = generatePreview(state);
      if (preview) {
        updateSelectorPreview({ selectorId: id, preview });
      }
    }
  }, [generatePreview, updateSelectorPreview, state, id]);

  if (!state) {
    if (readOnly) {
      return null;
    }

    return (
      <DrawBox
        onCreate={box => {
          if (updateSelector) {
            updateSelector(box);
          }
        }}
      />
    );
  }

  return (
    <RegionHighlight
      key={id}
      region={state as any}
      isEditing={!readOnly}
      background={
        !readOnly
          ? 'transparent'
          : isAdjacent
          ? 'rgba(141,160,203,.1)'
          : isTopLevel
          ? 'rgba(141,160,203,.4)'
          : 'rgba(252,141,98, .4)'
      }
      border={isTopLevel ? '5px solid #000' : '5px solid rgba(5, 42, 68, 0.2)'}
      onSave={box => {
        if (updateSelector) {
          updateSelector(box);
        }
      }}
      onClick={() => (onClick ? onClick(props) : undefined)}
    />
  );
};

export default BoxSelectorAtlas;
