/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/preline/preline.js',
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7956",
        secondary: "#00C4AE",
        tertiary: "#FFD541",
        quaternary: "#100C08",
        spaceblack: "#414A4C",
        dashgreen: "#1BCFB4",
        dashGray:"#F8F9FA",
        lightBlue:"#5A4BDA",
        darkGray:"#ebebeb",
      },

    },
    fontFamily: {
      Oswald: ['Oswald', 'sans-serif'],
      Josefin_Sans: ['Josefin Sans', 'sans-serif'],
      Montserrat: ['Montserrat', 'sans-serif'],
      RedditSans: ["Reddit Sans", 'serif'],    
    },
  },
  plugins: [
    require('preline/plugin'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"], // DaisyUI themes
  },
  future: {
    experimentalColorFunctions: true,
  },
};
