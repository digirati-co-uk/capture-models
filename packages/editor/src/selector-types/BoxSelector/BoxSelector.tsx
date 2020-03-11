import { BaseSelector, SelectorComponent } from '@capture-models/types';
import React from 'react';

export interface BoxSelectorProps extends BaseSelector {
  id: string;
  type: 'box-selector';
  state: null | {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

type BoxSelectorPreview = {
  thumbnail: string;
};

export const BoxSelector: SelectorComponent<BoxSelectorProps> = ({ chooseSelector, clearSelector, ...props }) => {
  if (props.selectorPreview) {
    const preview: BoxSelectorPreview = props.selectorPreview;
    console.log(preview.thumbnail);
    // @todo thumbnail?
  }

  const isSelecting = props.currentSelectorId === props.id;

  if (isSelecting) {
    return (
      <div>
        Move and resize the highlighted box on the image to choose your selection.{' '}
        {clearSelector ? <button onClick={clearSelector}>finish</button> : null}
      </div>
    );
  }
  if (props.state) {
    return (
      <div>
        You selected a thing at {props.state.x}, {props.state.y}, {props.state.width}, {props.state.height}{' '}
        {chooseSelector ? <button onClick={() => chooseSelector(props.id)}>edit</button> : null}
      </div>
    );
  }

  return (
    <div>
      You can add a box {chooseSelector ? <button onClick={() => chooseSelector(props.id)}>edit</button> : null}
    </div>
  );

  // hasRegion = state !== undefined
  // selecting = currentSelectorId === selector.id

  // You have selected a region [preview] [edit]
  // -OR-
  // You have not yet selected a region [draw box]
  // Preview: Thumbnail OR text co-ordinates

  // => When selecting
  // Move and resize the highlighted box on the image to choose your selection.
};
