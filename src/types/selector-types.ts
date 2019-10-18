export type BoxSelector = {
  type: 'box-selector';
  state: null | {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type SelectorTypes = BoxSelector;
