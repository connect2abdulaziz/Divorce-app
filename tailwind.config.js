/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F6",
        ink: "#21231F",
        muted: "#6B6A63",
        line: "#DAD6CB",
        accent: {
          DEFAULT: "#3F6659",
          soft: "#EAEFEC",
          dark: "#2C4A40",
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
