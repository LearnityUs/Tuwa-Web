/** @type {import('tailwindcss').Config} */
import { zinc, rose } from 'tailwindcss/colors';
import tailwindcssSafeArea from 'tailwindcss-safe-area';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                gray: zinc,
                theme: {
                    '50': '#f3f1ff',
                    '100': '#ebe5ff',
                    '200': '#d9ceff',
                    '300': '#bea6ff',
                    '400': '#9f75ff',
                    '500': '#843dff',
                    '600': '#7916ff',
                    '700': '#6b04fd',
                    '800': '#5a03d5',
                    '900': '#4b05ad',
                    '950': '#2c0076'
                },
                danger: rose
            }
        }
    },
    plugins: [tailwindcssSafeArea]
};
