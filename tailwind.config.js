/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "blue-purple": "#7976ff",
        "sprite-green": "#6dc871",
        "slate-gray": "#939393",
        "border-gray": "#5c5c5c",
        "moments-gray": "#303030",
        "dark-gray": "#161616",
        "mainsite-mobile-gray": "#353535",
      },
      fontFamily: {
        sans: ["Karla", "sans-serif"],
        serif: ["Rawgly", "serif"],
      },
      maxWidth: {
        "between-lg-xl": "1050px",
      },
    },
  },
  plugins: [require("daisyui")],
};
