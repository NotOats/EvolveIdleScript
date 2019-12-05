import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import userscriptHeader from 'rollup-plugin-userscript-header';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';

import {bundleConfig, userscriptConfig} from './config.js';

const production = !process.env.ROLLUP_WATCH;

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
        production && terser(),
        userscriptHeader({
            overwrite: userscriptConfig,
        }),
    ],
};
