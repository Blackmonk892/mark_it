/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/src/**/*.{js,ts,jsx,tsx,html}', './src/renderer/index.html'],
  theme: {
    fontFamily: {
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace'
      ]
    },
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
