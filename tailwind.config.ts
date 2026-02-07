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
        // BrandON Official Color Palette
        'brand-primary': '#1E6E27', // Primary Green
        'brand-secondary': '#283548', // Secondary Blue-Grey
        'brand-accent': '#2C3C53', // Accent
        'brand-base': '#1C293C', // Dark Blue/Charcoal Base
      },
    },
  },
  plugins: [],
}
export default config