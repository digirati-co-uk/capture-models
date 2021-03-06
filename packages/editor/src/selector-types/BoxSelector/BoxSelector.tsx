import { CardButton } from '../../components/CardButton/CardButton';
import { BaseSelector, SelectorComponent } from '@capture-models/types';
import React from 'react';
import styled from 'styled-components/macro';

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

export const CroppedImage = styled.div<{ $size?: 'small' | 'large' }>`
  background: #000;
  padding: 2px;
  height: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    display: inline-block;
    object-fit: contain;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
  }
`;

export const BoxSelector: SelectorComponent<BoxSelectorProps> = ({
  chooseSelector,
  clearSelector,
  updateSelector,
  readOnly,
  ...props
}) => {
  const isSelecting = props.currentSelectorId === props.id;

  if (props.state) {
    return (
      <div>
        {props.selectorPreview ? (
          <CroppedImage>
            <img
              src={props.selectorPreview}
              alt={`You selected a region at ${props.state.x}, ${props.state.y}, ${props.state.width}, ${props.state.height}`}
            />
          </CroppedImage>
        ) : (
          <>
            You selected a region at {props.state.x}, {props.state.y}, {props.state.width}, {props.state.height}
          </>
        )}
        <br />
        {chooseSelector && !readOnly ? (
          isSelecting ? (
            <div>
              Move and resize the highlighted box on the image to choose your selection.
              <br />
              {props.state && updateSelector ? (
                <SelectorButton
                  inline={true}
                  size="small"
                  onClick={() => updateSelector(null)}
                  style={{ marginRight: 10 }}
                >
                  discard selection
                </SelectorButton>
              ) : null}
            </div>
          ) : (
            <SelectorButton inline={true} size="small" onClick={() => chooseSelector(props.id)}>
              edit region
            </SelectorButton>
          )
        ) : null}
      </div>
    );
  }

  return (
    <div>
      No region has been selected. Draw a box on the image to define a region.
      <br />
      {chooseSelector && !readOnly ? (
        <SelectorButton inline={true} size="small" onClick={() => chooseSelector(props.id)}>
          define region
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
