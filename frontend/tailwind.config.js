export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf4",
          100: "#d8f4e5",
          500: "#1f8a5b",
          700: "#166a46",
          900: "#0b3d2a",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
