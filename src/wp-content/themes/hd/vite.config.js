import * as path from 'path';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import {sharedConfig} from '../../../../vite.config.shared';

// THEME
const dir = path.resolve(__dirname).replace(/\\/g, '/');
const resources = `${dir}/resources`;
const assets = `${dir}/assets`;

// COPY
const directoriesToCopy = [
    {src: `${resources}/img`, dest: ''}
];

// SASS
const sassFiles = [
    // (partials)
    'partials/woocommerce',

    // (template)
    'partials/template/extra',
    'partials/template/page-about',
    'partials/template/page-contact',
    'partials/template/page-affordable-design',
    'partials/template/page-professional-design',
    'partials/template/page-home',

    // (entries)
    'admin',
    'editor-style',
    'index',
];

// JS
const jsFiles = [
    // (components)
    'components/preflight',
    'components/social-share',
    'components/swiper',
    'components/woocommerce',

    // (template)
    'components/template/extra',
    'components/template/page-home',
    'components/template/page-design-affordable',

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
                entryFileNames: `js/[name].[hash].js`,
                chunkFileNames: `js/[name].[hash].js`,
                manualChunks(id) {
                    if (id.includes('node_modules') || id.includes('styles/tailwind') || id.includes('scripts/3rd') || id.includes('styles/3rd')) {
                        return 'vendor';
                    }
                },
                assetFileNames: (assetInfo) => {
                    const name = assetInfo.name || '';
                    if (name.endsWith('.css')) {
                        return `css/[name].[hash].css`;
                    }
                    if (/\.(woff2?|ttf|otf|eot)$/i.test(name)) {
                        return `fonts/[name].[ext]`;
                    }
                    if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name)) {
                        return `img/[name].[ext]`;
                    }
                    return `files/[name].[ext]`;
                },
            },
        },
    },
};
