import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#12283f",
        teal: "#168a83",
        ink: "#172b3a",
        muted: "#6d7f8e",
        line: "#e5ebef",
        canvas: "#f6f8fa",
      },
      boxShadow: {
        card: "0 2px 12px rgba(18, 40, 63, 0.045)",
      },
    },
  },
  plugins: [],
};

export default config;
