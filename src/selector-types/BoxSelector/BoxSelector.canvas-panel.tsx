import React, { useState } from 'react';
import { SelectorComponent } from '../../types/selector-types';
import { BoxSelectorProps } from './BoxSelector';
// @ts-ignore
import EditableAnnotation from '@canvas-panel/core/es/components/EditableAnnotation/EditableAnnotation';

const BoxSelectorCanvasPanel: SelectorComponent<BoxSelectorProps> = props => {
  const [selector, setSelector] = useState<BoxSelectorProps['state']>(props.state);

  if (!props.state) return null;

  return (
    <EditableAnnotation
      {...props}
      {...props.state}
      ratio={1}
      setCoords={(coords: any) => {
        setSelector({ ...selector, ...coords });
        props.updateSelector({ ...selector, ...coords });
      }}
      style={{ background: 'red' }}
    />
  );
};

export default BoxSelectorCanvasPanel;
