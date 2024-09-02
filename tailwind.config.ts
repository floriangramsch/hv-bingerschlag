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
        bg: "#2c3e50",
        "bg-lighter": "#486581",
        text: "#ecf0f1",
        primary: "#e74c3c",
        secondory: "#1f2b37",
        button: "#007bff",
      },
    },
  },
  plugins: [],
};
export default config;
