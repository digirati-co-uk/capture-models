export type BoxSelector =
  | {
      type: 'box-selector';
      state: null | {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }
  | {
      type: 'point-selector';
      state: null | {
        x: number;
        y: number;
      };
    };

export type SelectorTypes = BoxSelector;
