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
                name: 'TUWA Gunn App',
                short_name: 'TUWA',
                theme_color: '#09090b',
                start_url: '/home',
                icons: [
                    {
                        src: '/icon/128.png',
                        sizes: '128x128',
                        type: 'image/png'
                    },
                    {
                        src: '/icon/256.png',
                        sizes: '256x256',
                        type: 'image/png'
                    },
                    {
                        src: '/icon/512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/icon/1024.png',
                        sizes: '1024x1024',
                        type: 'image/png'
                    }
                ]
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
