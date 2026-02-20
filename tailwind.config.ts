import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BrandON Official Color Palette - Enhanced Depth & Contrast
        'brand-primary': {
          DEFAULT: '#22C55E', // Vibrant Green (enhanced from #1E6E27)
          dark: '#16A34A', // Deeper green for hover states
          light: '#4ADE80', // Light green for accents
        },
        'brand-secondary': {
          DEFAULT: '#1E293B', // Deeper slate (enhanced from #283548)
          light: '#334155', // Lighter slate for cards
          dark: '#0F172A', // Almost black for depth
        },
        'brand-accent': {
          DEFAULT: '#3B4B63', // Enhanced blue-grey (from #2C3C53)
          light: '#475569', // Lighter accent
          dark: '#1E2936', // Darker accent
        },
        'brand-base': {
          DEFAULT: '#0F172A', // Deepest dark blue (enhanced from #1C293C)
          light: '#1E293B', // Slightly lighter base
        },
      },
    },
  },
  plugins: [],
}
export default config