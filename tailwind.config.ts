/** @type {import('tailwindcss').Config} */
import { zinc, red, rose, indigo } from 'tailwindcss/colors';
import tailwindcssSafeArea from 'tailwindcss-safe-area';
import tailwindcssEasing from 'tailwindcss-easing';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                theme: rose,
                themedark: indigo,
                danger: red,
                milk: {
                    '50': '#f6f5f4',
                    '100': '#eceae8',
                    '200': '#d8d4d0',
                    '300': '#bfb8b2',
                    '400': '#a59a92',
                    '500': '#93847c',
                    '600': '#867770',
                    '700': '#70625e',
                    '800': '#5d524f',
                    '900': '#4c4342',
                    '950': '#282322'
                },
                rice: zinc
            }
        }
    },
    plugins: [tailwindcssSafeArea, tailwindcssEasing]
};
