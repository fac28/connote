// import type { Config } from "tailwindcss";
// const { nextui } = require("@nextui-org/react");

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//     },
//   },
//   // darkMode: "class",
//   plugins: [nextui()],
// };
// export default config;

import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "3rem",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            background: "#FFF7F3",
          }, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            background: "#FFF7F3",
          }, // dark theme colors
        },
        // modern: {
        //   extend: "dark", // <- inherit default values from dark theme
        //   colors: {
        //     background: "#0D001A",
        //     foreground: "#ffffff",
        //     primary: {
        //       50: "#3B096C",
        //       100: "#520F83",
        //       200: "#7318A2",
        //       300: "#9823C2",
        //       400: "#c031e2",
        //       500: "#DD62ED",
        //       600: "#F182F6",
        //       700: "#FCADF9",
        //       800: "#FDD5F9",
        //       900: "#FEECFE",
        //       DEFAULT: "#DD62ED",
        //       foreground: "#ffffff",
        //     },
        //     focus: "#F182F6",
        //   },
        //   layout: {
        //     disabledOpacity: "0.3",
        //     radius: {
        //       small: "1px",
        //       medium: "2px",
        //       large: "4px",
        //     },
        //     borderWidth: {
        //       small: "1px",
        //       medium: "2px",
        //       large: "3px",
        //     },
        //   },
        // },
      },
    }),
  ],
};
export default config;
