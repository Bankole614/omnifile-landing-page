/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        paper: '#F4F5F9',
        ink: { DEFAULT: '#12162B', soft: '#4A5070' },
        brand: { DEFAULT: '#4F46E5', deep: '#312E81', tint: '#EEF0FF' },
      },
    },
  },
  plugins: [],
};
