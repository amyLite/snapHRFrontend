/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],  // Default sans-serif font
        serif: ["Merriweather", "serif"],  // Default serif font
        mono: ["Roboto Mono", "monospace"],  // Default monospace font
      },
    },
    screens:{
      'sm': '100px',
      // => @media (min-width: 640px) { ... }

      'md': '540px',
      // => @media (min-width: 768px) { ... }

      'lg': '1000px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1536px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '2280px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
}

