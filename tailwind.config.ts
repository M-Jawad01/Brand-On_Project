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
        // Placeholder brand colors - to be customized
        'brand-primary': '#3B82F6', // Blue-500
        'brand-secondary': '#10B981', // Emerald-500
        'brand-accent': '#F59E0B', // Amber-500
        // Add more as needed
      },
    },
  },
  plugins: [],
}
export default config