import { SelectorComponent } from '@capture-models/types';
import React, { useCallback, useEffect } from 'react';
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

  const onSave = useCallback(
    (box: any) => {
      if (updateSelector) {
        updateSelector(box);
      }
    },
    [updateSelector]
  );

  if (!state) {
    if (readOnly) {
      return null;
    }

    return <DrawBox onCreate={onSave} />;
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
      onSave={onSave}
      onClick={() => (onClick ? onClick(props) : undefined)}
    />
  );
};

export default BoxSelectorAtlas;
