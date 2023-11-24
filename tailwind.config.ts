import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        connote_orange: '#F9844A',
        connote_green: '#43AA8B',
        connote_pastel_blue: '#0CA1E2',
        connote_pastel_yellow: '#ECBC0F',
        connote_pastel_purple: '#783697',
        connote_white: '#F9FEFE',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        md: '1.5rem',
        lg: '3rem',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#FFF7F3',
            primary: '#242230',
            secondary: '#F9FEFE',
          },
        },
        dark: {
          colors: {
            background: '#210230',
            primary: '#F9FEFE',
            secondary: '#451952',
          },
        },
      },
    }),
  ],
};
export default config;
