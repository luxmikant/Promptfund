import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FBFBF9",
        surface: "#FFFFFF",
        stone: {
          wash: "#F4F4F0",
          hairline: "#E6E6E1",
        },
        ink: {
          obsidian: "#111110",
          graphite: "#686763",
          subtle: "#9E9D98",
        },
        paypal: {
          cobalt: "#005EA6",
          dark: "#003087",
          hover: "#004d88",
        },
        clearinghouse: {
          green: "#0D7A5F",
          light: "#E7F6F1",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(2px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
