import { SelectorComponent } from '@capture-models/types';
import React, { useEffect, useState } from 'react';
import { BoxSelectorProps } from './BoxSelector';
// @ts-ignore
import EditableAnnotation from '@canvas-panel/core/es/components/EditableAnnotation/EditableAnnotation';
import { useViewer } from '../../content-types/CanvasPanel/CanvasPanel';

const BoxSelectorCanvasPanel: SelectorComponent<BoxSelectorProps> = props => {
  const [selector, setSelector] = useState<BoxSelectorProps['state']>(props.state);
  const viewer = useViewer();

  useEffect(() => {
    if (viewer && props.state && props.isTopLevel) {
      const t = setTimeout(() => {
        viewer.goToRect(props.state, 50);
      }, 100);
      return () => {
        clearTimeout(t);
        viewer.resetView();
      };
    }
    return () => {};
  }, [props.isTopLevel, props.state, viewer]);

  if (!props.state) return null;

  if (props.readOnly) {
    return (
      <EditableAnnotation
        {...props}
        {...props.state}
        ratio={1}
        boxStyles={{ pointerEvents: 'none', background: 'rgba(100,100,100,.1)', outline: '5px solid rgba(0,0,80,.8)' }}
      />
    );
  }

  return (
    <EditableAnnotation
      {...props}
      {...props.state}
      ratio={1}
      setCoords={(coords: any) => {
        setSelector({ ...selector, ...coords });
        if (props.updateSelector) {
          props.updateSelector({ ...selector, ...coords });
        }
      }}
      style={{ background: 'red' }}
    />
  );
};

export default BoxSelectorCanvasPanel;
