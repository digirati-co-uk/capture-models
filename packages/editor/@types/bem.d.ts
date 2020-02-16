declare module '@fesk/bem-js' {
  export type ModMap = {
    [mod: string]: boolean | undefined;
  };

  export type Block = {
    element(name: string): Element;
    modifier(name: string, should: boolean = true): Block;
    modifiers(mods: ModMap): Block;
    toString(): string;
  } & string;

  export type Element = {
    toString(): string;
    modifier(mod: string, should: boolean): Element;
    modifiers(mods: ModMap): Element;
  } & string;

  export type Bem = {
    block: (name: string) => Block;
  };

  declare var bem: Bem;

  export = bem;
}
