import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        // devtools(),
        solidPlugin()
        // VitePWA({
        //     manifest: {
        //         name: 'GUNN TUWA',
        //         short_name: 'TUWA',
        //         theme_color: '#ffffff'
        //     }
        // })
    ],
    server: {
        port: 3000
    },
    build: {
        target: 'esnext'
    }
});
