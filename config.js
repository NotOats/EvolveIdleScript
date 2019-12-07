import path from 'path';

export const bundleConfig = {
    bundleName: 'EvolveIdleScript.user.js',
    bundlePath: './dist/',

    entryPointName: 'index.js',
    entryPointPath: './src/',

    get bundle() {
        return path.join(this.bundlePath, this.bundleName);
    },

    get entryPoint() {
        return path.join(this.entryPointPath, this.entryPointName);
    },
};

export const userscriptConfig = {
    name: 'EvolveIdleScript',
    match: 'https://pmotschmann.github.io/Evolve/',
    require: [
        'https://code.jquery.com/jquery-3.3.1.min.js',
        'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
    ],
    grant: 'none',
};
