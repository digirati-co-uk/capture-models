import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  colors: {
    primary: '#5F40E1',
    textOnPrimary: '#fff',
    mutedPrimary: '#E3DDFD',
    textOnMutedPrimary: '#5F40E1',
  },
  sizes: {
    text: '13px',
    headingLg: '22px',
    headingMd: '18px',
    headingSm: '15px',
    buttonLg: '18px',
    buttonMd: '15px',
    buttonSm: '13px',
  },
  card: {
    shadow: '0 2px 41px 0 rgba(0,0,0,0.15)',
    large: {
      padding: '20px',
      radius: '10px',
      margin: '30px',
    },
    medium: {
      padding: '17px',
      radius: '10px',
      margin: '25px',
    },
    small: {
      padding: '15px',
      radius: '8px',
      margin: '20px',
    },
  },
};
