import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        devtools({
            autoname: true
        }),
        solidPlugin(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'GUNN TUWA',
                short_name: 'TUWA',
                theme_color: '#030712'
            }
        })
    ],
    publicDir: 'public',
    server: {
        port: 3000
    },
    build: {
        target: 'esnext'
    }
});
