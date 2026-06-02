/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand Primary Colors - Sage Green
        brand: {
          primary: "#B6C4A2",
          "primary-dark": "#c8d0a5",
          "primary-light": "#eaf0d0",
        },
        // Dark Theme Background
        background: {
          DEFAULT: "#1E1E1E",
          card: "#2A2A2A",
          elevated: "#333333",
        },
        // Text Colors
        foreground: {
          DEFAULT: "#F2F2F2",
          muted: "#A0A0A0",
          subtle: "#6B6B6B",
        },
        // Glass Effect Colors
        glass: {
          light: "rgba(255, 255, 255, 0.15)",
          medium: "rgba(255, 255, 255, 0.20)",
          dark: "rgba(0, 0, 0, 0.20)",
          border: "rgba(255, 255, 255, 0.20)",
        },
        // Status Colors
        destructive: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
