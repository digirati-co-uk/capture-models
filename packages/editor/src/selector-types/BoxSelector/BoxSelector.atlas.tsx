import { SelectorComponent } from '@capture-models/types';
import React from 'react';
import { BoxSelectorProps } from './BoxSelector';
import { DrawBox, RegionHighlight } from '@atlas-viewer/atlas';

const BoxSelectorAtlas: SelectorComponent<BoxSelectorProps> = props => {
  if (!props.state) {
    return (
      <DrawBox
        onCreate={box => {
          if (props.updateSelector) {
            props.updateSelector(box);
          }
        }}
      />
    );
  }

  return (
    <RegionHighlight
      region={props.state as any}
      isEditing={!props.readOnly}
      onSave={box => {
        if (props.updateSelector) {
          props.updateSelector(box);
        }
      }}
      onClick={() => {}}
    />
  );
};

export default BoxSelectorAtlas;
