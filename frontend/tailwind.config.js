/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#eb8e3a',
                    dark: '#1a2035',
                },
                brand: {
                    primary: '#eb8e3a',
                    dark: '#1a2035',
                    bg: '#f3f4f6',
                }
            },
            fontFamily: {
                sans: ['Raleway', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
