import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#2563EB",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          light: "#F3F4F6",
          dark: "#1F2937"
        }
      }
    },
  },
  plugins: [],
} satisfies Config;

