import React from 'react';

export type BaseSelector<T extends { type: string; state: any }> = T & {
  type: T['type'];
  state: null | T['state'];
};

export type PointSelector = BaseSelector<{
  type: 'point-selector';
  state: null | {
    x: number;
    y: number;
  };
}>;

export type BoxSelector = BaseSelector<{
  type: 'box-selector';
  state: null | {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}>;

export type SelectorTypes = BoxSelector | PointSelector;

export type SelectorTypeProps<T extends SelectorTypes> = T & {
  updateSelector(state: T['state']): void;
};

export type SelectorComponent<T extends SelectorTypes> = React.FC<
  SelectorTypeProps<T>
>;
