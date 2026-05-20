import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sport: '#EF4444',
        gaming: '#8B5CF6',
        movies: '#06B6D4',
        tv: '#EC4899',
        music: '#F59E0B',
        holiday: '#10B981',
        awareness: '#3B82F6',
        astro: '#6366F1',
        tech: '#F97316',
        calendar: '#6B7280',
        awards: '#D946EF',
        seasons: '#84CC16',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
