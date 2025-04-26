import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#89c9db", // Soft Aqua Blue-Green
          hover: "#70b0c2", // Slightly darker for hover states
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#FF7A5A", // Coral accent color for CTAs
          foreground: "white",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        charcoal: {
          DEFAULT: "#333333", // Charcoal gray
          light: "#555555", // Lighter charcoal
        },
        purple: {
          500: "#9C27B0", // Purple
        },
        green: {
          500: "#4CAF50", // Green
        },
        amber: {
          500: "#FFC107", // Amber
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "color-shift": {
          "0%": { backgroundColor: "#ffffff" },
          "50%": { backgroundColor: "#f5f5f5" },
          "100%": { backgroundColor: "#ffffff" },
        },
        "text-fade": {
          "0%": { opacity: "0" },
          "25%": { opacity: "1" },
          "75%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "background-wave": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "color-shift": "color-shift 8s infinite",
        "text-fade": "text-fade 4s ease-in-out infinite",
        "background-wave": "background-wave 10s ease infinite",
        float: "float 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-wave": "linear-gradient(45deg, #89c9db, #9ad4e5, #abd9e8, #bce3f0, #abd9e8, #9ad4e5, #89c9db)",
        "gradient-dark": "linear-gradient(to right, #1a1a1a, #2d2d2d, #1a1a1a)",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, #89c9db, #FF7A5A, #9C27B0, #4CAF50, #89c9db)",
      },
      boxShadow: {
        neon: "0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)",
        "neon-accent": "0 0 5px theme(colors.accent.DEFAULT), 0 0 20px theme(colors.accent.DEFAULT)",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
