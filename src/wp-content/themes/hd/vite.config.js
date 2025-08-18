import * as path from 'path';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {sharedConfig} from '../../../../vite.config.shared';

// THEME
const dir = path.resolve(__dirname).replace(/\\/g, '/');
const resources = `${dir}/resources`;
const assets = `${dir}/assets`;

// COPY
const directoriesToCopy = [
    {src: `${resources}/img`, dest: ''},
];

// SASS
const sassFiles = [
    // (partials)
    'partials/home-css',
    'partials/woocommerce-css',

    // (entries)
    'admin-css',
    'editor-style-css',
    'index-css',
];

// JS
const jsFiles = [
    // (components)
    'components/home',
    'components/preload-polyfill',
    'components/swiper',
    'components/woocommerce',

    // (entries)
    'admin',
    'index',
];

export default {
    ...sharedConfig,
    plugins: [
        ...sharedConfig.plugins,
        viteStaticCopy({
            targets: directoriesToCopy,
        }),
    ],
    build: {
        ...sharedConfig.build,
        outDir: `${assets}`,
        assetsDir: '',
        rollupOptions: {
            input: [
                ...sassFiles.map((file) => `${resources}/styles/${file}.scss`),
                ...jsFiles.map((file) => `${resources}/scripts/${file}.js`),
            ],
            output: {
                entryFileNames: `js/[name].js`,
                chunkFileNames: `js/[name].js`,
                manualChunks(id) {
                    if (
                        id.includes('styles/tailwind') ||
                        id.includes('node_modules') ||
                        id.includes('scripts/3rd') ||
                        id.includes('styles/3rd')
                    ) {
                        return '_vendor';
                    }
                },
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name || '';
                    if (name.endsWith('.css')) {
                        return `css/[name].css`;
                    }
                    if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
                        return `fonts/[name].[ext]`;
                    }
                    return `img/[name].[ext]`;
                },
            },
        },
    },
};
