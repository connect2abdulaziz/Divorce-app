/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f5f8fb",
        ink: "#16324a",
        muted: "#5b6f7f",
        line: "#d7e1ea",
        navy: {
          DEFAULT: "#0b3a5c",
          deep: "#07263d",
          soft: "#4f6a7a",
        },
        accent: {
          DEFAULT: "#0f8a6b",
          soft: "#e6f5f0",
          dark: "#0c7359",
        },
        caution: "#9B6B3B",
        error: "#9B3B3B",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "42rem",
      },
    },
  },
  plugins: [],
};
