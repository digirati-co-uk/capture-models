import { CardButton } from '../../components/CardButton/CardButton';
import { BaseSelector, SelectorComponent } from '@capture-models/types';
import React from 'react';
import styled from 'styled-components';

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

const SelectorButton = styled(CardButton)`
  margin-bottom: 0;
  margin-top: 10px;
  padding: 0.3em 0.7em;
`;

export const BoxSelector: SelectorComponent<BoxSelectorProps> = ({
  chooseSelector,
  clearSelector,
  readOnly,
  ...props
}) => {
  if (props.selectorPreview) {
    const preview: BoxSelectorPreview = props.selectorPreview;
    console.log(preview.thumbnail);
    // @todo thumbnail?
  }

  const isSelecting = props.currentSelectorId === props.id;

  if (isSelecting) {
    return (
      <div>
        Move and resize the highlighted box on the image to choose your selection.
        <br />
        {clearSelector && !readOnly ? (
          <SelectorButton inline={true} size="small" onClick={clearSelector}>
            finish
          </SelectorButton>
        ) : null}
      </div>
    );
  }
  if (props.state) {
    return (
      <div>
        You selected a thing at {props.state.x}, {props.state.y}, {props.state.width}, {props.state.height}
        <br />
        {chooseSelector && !readOnly ? (
          <SelectorButton inline={true} size="small" onClick={() => chooseSelector(props.id)}>
            edit
          </SelectorButton>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      No region has been selected
      <br />
      {chooseSelector && !readOnly ? (
        <SelectorButton inline={true} size="small" onClick={() => chooseSelector(props.id)}>
          choose region
        </SelectorButton>
      ) : null}
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
