import React from 'react';
import { SelectorComponent } from '../../types/selector-types';

export type BoxSelectorProps = {
  type: 'box-selector';
  state: null | {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const BoxSelector: SelectorComponent<BoxSelectorProps> = () => {
  return <div>Box selector</div>;
};
