/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f766e', // Teal
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f97316', // Orange
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#fef3c7', // Light yellow/cream
          foreground: '#1f2937',
        },
        background: '#ffffff',
        foreground: '#1f2937',
        muted: {
          DEFAULT: '#6b7280',
          foreground: '#9ca3af',
        },
        border: '#e5e7eb',
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        ring: '#0f766e',
        input: '#e5e7eb',
      },
    },
  },
  plugins: [],
}