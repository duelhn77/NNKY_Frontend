// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Segoe UI', 'Roboto', 'sans-serif'], // 落ち着きのある洗練フォント
        heading: ['"Playfair Display"', 'serif'], // タイトルに高級感
      },
      colors: {
        primary: {
          DEFAULT: '#1E3A8A', // 落ち着いたネイビー
          light: '#3B82F6',
          dark: '#1E40AF',
        },
        accent: {
          DEFAULT: '#F59E0B', // 高級感あるゴールド
          light: '#FBBF24',
        },
        base: {
          light: '#F9FAFB',
          dark: '#111827',
        },
      },
    },
  },
  plugins: [require('daisyui')],
};
