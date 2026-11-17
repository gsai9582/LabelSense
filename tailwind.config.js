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
        // Semantic Token Mapping
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        subtle: 'var(--bg-subtle)',
        'hairline': 'var(--border-hairline)',
        'border-subtle': 'var(--border-subtle)',
        'border-strong': 'var(--border-strong)',

        // Typography Tokens
        'txt-primary': 'var(--text-primary)',
        'txt-secondary': 'var(--text-secondary)',
        'txt-muted': 'var(--text-muted)',
        'txt-inverse': 'var(--text-inverse)',

        // Single Brand Accent - Clinical Teal
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        medtech: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
          800: '#134e4a',
          900: '#090d16',
          950: '#042f2e',
        },

        // Semantic Status Colors
        pass: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#059669',
        },
        review: {
          light: '#fffbeb',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        critical: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        alert: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      letterSpacing: {
        'tightest': '-0.025em',
        'tighter': '-0.015em',
      },
      boxShadow: {
        'hairline': '0 0 0 1px var(--border-hairline)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
