/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medtech: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c3d7e9',
          300: '#95bcdc',
          400: '#609dcb',
          500: '#3c81b6',
          600: '#2b6697',
          700: '#24527b',
          800: '#204667',
          900: '#0f172a',
          950: '#090d16',
        },
        pass: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        review: {
          light: '#fffbeb',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        alert: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
