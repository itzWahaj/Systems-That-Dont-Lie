import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "rgb(var(--background) / <alpha-value>)",
                surface: "rgb(var(--surface) / <alpha-value>)",
                accent: "rgb(var(--accent) / <alpha-value>)",
                secondary: "rgb(var(--secondary) / <alpha-value>)",
                muted: "rgb(var(--text-muted) / <alpha-value>)",
                border: "rgb(var(--border) / <alpha-value>)",
                main: "rgb(var(--text-main) / <alpha-value>)",
            },
            fontFamily: {
                serif: ["var(--font-cinzel)", "serif"],
                sans: ["var(--font-inter)", "sans-serif"],
                mono: ["var(--font-source-code)", "monospace"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
};
export default config;
