import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E1",
        parchment: "#EAE2CB",
        teal: "#0F4C49",
        teal2: "#176E69",
        moss: "#2E6F66",
        amber: "#E0A24A",
        ember: "#C97B2A",
        ink: "#1F2A2A",
        slate: "#5C6A66",
        leaf: "#7BA89B"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"]
      },
      borderRadius: {
        organic: "14px",
        bloom: "22px"
      }
    }
  },
  plugins: []
};

export default config;
