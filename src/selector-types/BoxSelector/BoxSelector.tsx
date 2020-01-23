import React from 'react';
import { SelectorComponent } from '../../types/selector-types';

export type BoxSelectorProps = {
  id: string;
  type: 'box-selector';
  state: null | {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type BoxSelectorPreview = {
  thumbnail: string;
};

export const BoxSelector: SelectorComponent<BoxSelectorProps> = props => {
  if (props.selectorPreview) {
    const preview: BoxSelectorPreview = props.selectorPreview;
    console.log(preview.thumbnail);
    // @todo thumbnail?
  }

  // hasRegion = state !== undefined
  // selecting = currentSelectorId === selector.id

  // You have selected a region [preview] [edit]
  // -OR-
  // You have not yet selected a region [draw box]
  // Preview: Thumbnail OR text co-ordinates

  // => When selecting
  // Move and resize the highlighted box on the image to choose your selection.

  return <div>Box selector</div>;
};
