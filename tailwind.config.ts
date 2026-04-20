import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FFFCF2",
          100: "#FBF4E0",
          200: "#F4E9CB",
          300: "#EAD9AE",
          400: "#DCC490",
          500: "#C2A568",
          700: "#8A7C60",
        },
        ink: {
          DEFAULT: "#3B1B4E",
          900: "#26102F",
          800: "#3B1B4E",
          700: "#5A2C70",
          600: "#703A89",
          500: "#8A55A2",
          300: "#B88AC9",
        },
        copper: {
          DEFAULT: "#E0A810",
          700: "#B88A0E",
          600: "#D09A13",
          500: "#E0A810",
          400: "#EBB71E",
          300: "#F3C94A",
        },
        coral: {
          DEFAULT: "#C28ED6",
          600: "#B074C8",
          500: "#C28ED6",
          400: "#D4A7DC",
          300: "#E6C0EA",
        },
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Space Grotesk"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(59, 27, 78, 0.35)",
        glow: "0 10px 40px -10px rgba(224, 168, 16, 0.45)",
        royal: "0 25px 80px -20px rgba(112, 58, 137, 0.55)",
      },
      backgroundImage: {
        "grain": "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/><feColorMatrix values=\\'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\'/></svg>')",
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
