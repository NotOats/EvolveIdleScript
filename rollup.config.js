import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import userscriptHeader from 'rollup-plugin-userscript-header';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import filesize from 'rollup-plugin-filesize';
import replace from '@rollup/plugin-replace';
import vue from 'rollup-plugin-vue';

import {bundleConfig, userscriptConfig} from './config.js';

// Default to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const production = (process.env.NODE_ENV == 'production');

export default {
    input: bundleConfig.entryPoint,
    output: {
        file: bundleConfig.bundle,
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: ['@babel/preset-env'],
            plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-private-methods',
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
