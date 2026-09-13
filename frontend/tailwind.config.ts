import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: "#08b3c9",
        tealMuted: "#52a6b4",
        tealDark: "#106f8e",
        pink: "#e274a9",
        orange: "#f09a39",
        violetLight: "#9e81b6",
        glass: "rgba(16, 111, 142, 0.4)",
        glassDark: "rgba(15, 12, 41, 0.75)"
      },
      backgroundImage: {
        'gta-sunset': 'linear-gradient(160deg, #6c80ba 0%, #b886b9 20%, #e6a0b3 40%, #fbc2a5 70%, #ffdf9f 100%)',
        'tiger-gradient': 'linear-gradient(90deg, #08b3c9, #e274a9, #f09a39)',
      }
    },
  },
  plugins: [],
};
export default config;
