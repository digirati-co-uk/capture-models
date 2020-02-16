import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      textOnPrimary: string;
      mutedPrimary: string;
      textOnMutedPrimary: string;
    };
    sizes: {
      text: string;
      headingLg: string;
      headingMd: string;
      headingSm: string;
      buttonLg: string;
      buttonMd: string;
      buttonSm: string;
    };
    card: {
      shadow: string;
      large: {
        padding: string;
        radius: string;
        margin: string;
      };
      medium: {
        padding: string;
        radius: string;
        margin: string;
      };
      small: {
        padding: string;
        radius: string;
        margin: string;
      };
    };
  }
}
