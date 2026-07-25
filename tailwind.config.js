/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0A0D0B",
          panel: "#12160F",
          alt: "#171C13",
          line: "rgba(236,243,236,0.08)",
        },
        emerald: {
          glow: "#34D399",
          deep: "#0F7A5C",
        },
        diamond: {
          DEFAULT: "#5EEAD4",
          soft: "#A7F3EE",
        },
        redstone: "#F2704A",
        bone: {
          DEFAULT: "#ECF3EC",
          dim: "#9BAA9C",
        },
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        emerald: "0 0 40px -10px rgba(52,211,153,0.45)",
        diamond: "0 0 40px -10px rgba(94,234,212,0.45)",
        panel: "0 20px 60px -20px rgba(0,0,0,0.6)",
      },
      backgroundImage: {
        "grid-glow":
          "linear-gradient(rgba(236,243,236,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(236,243,236,0.05) 1px, transparent 1px)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
    },
  },
  plugins: [],
};
