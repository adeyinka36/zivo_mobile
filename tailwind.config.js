/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FFFF00',
        secondary: '#F4A261',
        background: '#000000',
        error: '#FF0000',
        white: '#FFFFFF',
        black: '#000000',
      }
    }
  },
  plugins: [],
}