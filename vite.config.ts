import {BuildOptions, defineConfig, ServerOptions, splitVendorChunkPlugin, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA, VitePWAOptions} from "vite-plugin-pwa";
import path from "path";

let buildProdMod = true;
let isProductionMode = !process.env.SW_DEV;
let publicPath = "/";

// Load .env datas
process.env = {...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd())};
process.env.NODE_ENV = !process.env.SW_DEV ? 'production' : 'dev'

let SRV_options: Partial<ServerOptions> = {
    https : false,
    host: "localhost",
    port: 80,
}
if (isProductionMode) {
    SRV_options = {
        https : true,
        port: 443,
    };
    publicPath = process.env.VITE_APP_URL;
}

let BUILD_options: Partial<BuildOptions> = {
    rollupOptions: {
        input: {
            app: './index.html'
        },
        output: {
            assetFileNames: buildProdMod ? 'assets/[hash].[ext]' : 'assets/[name].[ext]',
            chunkFileNames: buildProdMod ? 'chunks/[hash].js' : 'chunks/[name].js',
            entryFileNames: assetInfo =>
                ['quickmaint-sw','registerServiceWorker'].includes(assetInfo.name) || !buildProdMod ? 'assets/[name].js' : 'assets/[name]-[hash].js',
        },
    },
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: isProductionMode && buildProdMod,
    cssMinify: isProductionMode && buildProdMod,
    cssCodeSplit: isProductionMode && buildProdMod,
    target:"esnext",
}

let PWA_options: Partial<VitePWAOptions> = {
    mode: process.env.SW_DEV ? 'development':'production',
    strategies: null,
    filename: "quickmaint-sw.js",
    srcDir: "src",
    /*injectManifest : {
        swSrc: "quickmaint-sw.js",
        swDest: "quickmaint-sw.js",
    },*/
    injectRegister: null,
    base: publicPath,
    scope: publicPath,
    registerType: 'autoUpdate',
    workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        sourcemap: false,
    },
    manifest: {
        name: "QuickMaint",
        short_name: "QuickMaint",
        description: "The simpliest access to Quickbrain v2 Maintenance Module",
        theme_color: "#000",
        background_color: "#FFFFFF",
        display_override: ["standalone","window-controls-overlay"],
        display: "standalone",
        icons: [
            {"src": "./img/icons/16x16.png","sizes": "16x16","type": "image/png","purpose": "any"},
            {"src": "./img/icons/32x32.png","sizes": "32x32","type": "image/png","purpose": "any"},
            {"src": "./img/icons/36x36.png","sizes": "36x36","type": "image/png","purpose": "any"},
            {"src": "./img/icons/48x48.png","sizes": "48x48","type": "image/png","purpose": "any"},
            {"src": "./img/icons/72x72.png","sizes": "72x72","type": "image/png","purpose": "any"},
            {"src": "./img/icons/96x96.png","sizes": "96x96","type": "image/png","purpose": "any"},
            {"src": "./img/icons/144x144.png","sizes": "144x144","type": "image/png","purpose": "any"},
            {"src": "./img/icons/150x150.png","sizes": "150x150","type": "image/png","purpose": "any"},
            {"src": "./img/icons/192x192.png","sizes": "192x192","type": "image/png","purpose": "any"},
            {"src": "./img/icons/512x512.png","sizes": "512x512","type": "image/png","purpose": "any"}
        ],
        screenshots: [
            { "src": "./img/screenshot_wide.png", "sizes": "484x463", "type": "image/png", "form_factor": "wide", "label": "QuickMaint" },
            { "src": "./img/screenshot_narrow.png", "sizes": "440x647", "type": "image/png", "form_factor": "narrow", "label": "QuickMaint" },
        ]
    },
    devOptions: {
        enabled: !isProductionMode,
        type: 'module',
    },
    selfDestroying: true,
    minify: isProductionMode
};

// Define config
export default defineConfig({
    plugins: [
        vue(),
        splitVendorChunkPlugin(),
        VitePWA( PWA_options )
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        },
    },
    appType: "spa",
    base: publicPath,
    server: SRV_options,
    build: BUILD_options,
})
