import {extendTheme} from '@chakra-ui/react';

/* RELEVANT LINKS
 * https://chakra-ui.com/docs/features/css-variables
 */

export default extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  colors: {
    primary: {
      50: '#e0f3fe',
      100: '#c2deee',
      200: '#9fc9df',
      300: '#7bb7d0',
      400: '#59a6c2',
      500: '#408fa8',
      600: '#2f7384', // main
      700: '#1e4e5f',
      800: '#0b2b3a',
      900: '#000d18',
    },
    light: {
      50: '#eef5f7',
      100: '#d1dfe3',
      200: '#b2c9d0',
      300: '#92b4bf',
      400: '#749fae',
      500: '#5b8695',
      600: '#486774',
      700: '#344a52',
      800: '#1f2c31',
      900: '#080f11',
    },
  },
});
