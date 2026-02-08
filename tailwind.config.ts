import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { withUt } from "uploadthing/tw";

const config: Config = withUt({
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C7A76C",
        "primary-hover": "#B08D55",
        "background-light": "#FFFFFF",
        "background-dark": "#0B0B0F",
        "surface-light": "#F9F9F9",
        "surface-dark": "#15151A",
        "text-light": "#1A1A1A",
        "text-dark": "#EAEAEA",
        "text-main-light": "#1A1A1A",
        "text-main-dark": "#E5E5E5",
        "text-muted-light": "#666666",
        "text-muted-dark": "#A0A0A0",
        "text-muted": "#7A7A86",
        "border-light": "#E5E5E5",
        "border-dark": "#2A2A30",
        "accent-gold": "#D4AF37",
        "background-alt": "#F5F5F7",
        "street-black": "#0a0a0a",
        "street-grey": "#262626",
        "street-red": "#dc2626",
      },
      borderRadius: {
        lg: "14px",
        xl: "18px",
        "2xl": "24px",
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        body: ["var(--font-body)", "Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        storefront: "0 25px 50px -12px rgba(0,0,0,0.65)",
        luxury: "0 20px 60px -24px rgba(0,0,0,0.22)",
        subtle: "0 10px 30px -18px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
      });
    }),
  ],
});

export default config;
