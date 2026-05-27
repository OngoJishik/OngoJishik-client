export const colors = {
  // Primary color - traditional red pepper paste color & main brand color
  primary: {
    50:  '#FFF5F0',
    100: '#FFE4D6',
    200: '#FFC4A8',
    300: '#FF9E73',  // Gochujang red
    400: '#E8723A',
    500: '#C85A28',  // Main brand color
    600: '#A04420',
    700: '#7A3218',
  },
  
  // Secondary color - natural forest green
  secondary: {
    50:  '#F0F7F0',
    100: '#D4E8D4',
    300: '#7CB87C',
    500: '#4A8C4A',  // Namul green
    700: '#2D5E2D',
  },

  // Neutral colors - hanji texture colors
  neutral: {
    0:   '#FFFFFF',
    50:  '#FAFAF8',  // Hanji light color
    100: '#F5F3EF',
    200: '#E8E4DD',
    300: '#D4CFC6',
    500: '#8C8578',
    700: '#4A463E',
    900: '#1C1A16',
  },

  // Meaning colors
  semantic: {
    error:   '#D32F2F',
    success: '#2E7D32',
    warning: '#F9A825',
    info:    '#1565C0',
  },

  // Traditional category colors
  category: {
    tteok:    '#E8A87C', // Rice cake color
    soup:     '#C85A28', // Soup red
    grill:    '#8B5E3C', // Grill charcoal brown
    namul:    '#4A8C4A', // Seasoned veggie green
    jjim:     '#B85C38', // Steamed dish red-brown
    myeon:    '#D4CFC6', // Noodles gray-white
    hangwa:   '#E8C87C', // Traditional sweets honey-yellow
    eumchung: '#7CB87C', // Beverages soft-green
  },
};
export type ColorTheme = typeof colors;
