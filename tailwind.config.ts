import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FBF7EE",
          100: "#F7F2E8",
          200: "#EFE9DD",
          300: "#E3DAC6",
          400: "#D6CBAF",
          500: "#B9AE8E",
          700: "#8A9AA5",
        },
        ink: {
          DEFAULT: "#1E3A4C",
          900: "#142A38",
          800: "#1E3A4C",
          700: "#2B4C60",
          500: "#3F6277",
          300: "#8A9AA5",
        },
        copper: {
          DEFAULT: "#B87333",
          600: "#B87333",
          500: "#C6894A",
          400: "#D09C68",
        },
        coral: {
          DEFAULT: "#D4806A",
          500: "#D4806A",
          400: "#DF9680",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(30,58,76,0.25)",
        glow: "0 10px 40px -10px rgba(184,115,51,0.35)",
      },
      backgroundImage: {
        "grain": "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/><feColorMatrix values=\\'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\'/></svg>')",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
