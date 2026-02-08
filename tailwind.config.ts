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
        primary: "#2E7C97",
        "primary-hover": "#1A4E61",
        secondary: "#1A4E61",
        accent: "#D4AF37",
        "accent-hover": "#C19A2E",
        background: "#F8FAFC",
        surface: "#ffffff",
        text: "#1f2d33",
        muted: "#64748B",
        border: "rgba(46,124,151,0.18)",
        "background-light": "#F8FAFC",
        "background-dark": "#0B0B0F",
        "surface-light": "#ffffff",
        "surface-dark": "#15151A",
        "text-light": "#1f2d33",
        "text-dark": "#EAEAEA",
        "text-main-light": "#1f2d33",
        "text-main-dark": "#E5E5E5",
        "text-muted-light": "#64748B",
        "text-muted-dark": "#A0A0A0",
        "text-muted": "#64748B",
        "border-light": "rgba(46,124,151,0.18)",
        "border-dark": "#2A2A30",
        "accent-gold": "#D4AF37",
        "background-alt": "#F4F8FA",
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
        body: ["var(--font-body)", "Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
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
