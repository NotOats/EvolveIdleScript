// Rollup plugins
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import userscriptHeader from 'rollup-plugin-userscript-header';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import filesize from 'rollup-plugin-filesize';
import replace from '@rollup/plugin-replace';
import vue from 'rollup-plugin-vue';

// Misc
import {bundleConfig, userscriptConfig} from './config.js';

// Default to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const production = (process.env.NODE_ENV == 'production');

const config = {
    input: bundleConfig.entryPoint,
    output: {
        file: bundleConfig.bundle,
        format: 'iife',
        sourcemap: true,
        globals: {
            'vue': 'Vue',
            'buefy': 'Buefy',
        },
    },
    external: [
        'vue',
        'buefy',
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env'],
            plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-private-methods',
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
        }),
        resolve(),
        commonjs(),
        webWorkerLoader(),
        vue({
            needMap: false,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        production && terser(),
        userscriptHeader({overwrite: userscriptConfig}),
        filesize({showGzippedSize: false}),
    ],
};

// Performance for development bundling
if (!production) {
    config.treeshake = false;
    config.output.indent = false;
}

export default config;
