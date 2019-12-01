// Browserify
import browserify from 'browserify';
import watchify from 'watchify';

// Gulp and plugins
import gulp from 'gulp';
import connect from 'gulp-connect';
import {development} from 'gulp-environments';
import header from 'gulp-header';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

// Misc
import {bundleConfig, userscriptConfig} from './config.js';
import log from 'fancy-log';
import {readFileSync} from 'fs';
import path from 'path';
import {stringify} from 'userscript-meta';

// Userscript header building
function trimFalsyLeaves(obj) {
    if (Array.isArray(obj)) {
        const filtered = obj.filter(Boolean);
        return filtered.length > 0 ? filtered : undefined;
    }
    if (typeof obj === 'string') {
        return obj.trim() || undefined;
    }
    if (typeof obj === 'object') {
        const filtered = Object.entries(obj)
            .filter(([, value]) => Boolean(trimFalsyLeaves(value)));
        return filtered.length > 0 ? filtered.reduce((newObj, [key, value]) => {
            newObj[key] = value;
            return newObj;
        }, {}) : undefined;
    }

    return obj;
}

let devBuildNumber = 0;
function createHeaderString(overwriteObj) {
    const packageJsonFile = path.resolve('package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonFile, 'utf8'));

    const defaultHeader = {
        name: packageJson.name || '',
        version: packageJson.version || '',
        author: packageJson.author || '',
        description: packageJson.description || '',
        homepage: packageJson.homepage || '',
        supportURL: typeof packageJson.bugs === 'string' ?
            packageJson.bugs : '',
        match: '*://*/*',
    };

    if (development()) {
        defaultHeader.version =
            `${defaultHeader.version}-build.[${devBuildNumber}]`;
        devBuildNumber++;
    }

    const header = trimFalsyLeaves({
        ...defaultHeader,
        ...(typeof overwriteObj === 'object' ? overwriteObj : {}),
    });

    return stringify(header);
}

// Bundling
function bundle(bundler) {
    return bundler.bundle()
        .on('error', function(err) {
            log.error(err.message);
            // eslint-disable-next-line no-invalid-this
            this.emit('end');
        })
        .pipe(source(bundleConfig.bundleName))
        .pipe(buffer())
        .pipe(development(sourcemaps.init({loadMaps: true})))
        .pipe(uglify())
        .pipe(header(createHeaderString(userscriptConfig)))
        .pipe(development(sourcemaps.write('./', {
            // Hard coded url prefix for gulp-connect
            'sourceMappingURLPrefix': 'http://127.0.0.1:42069',
        })))
        .pipe(gulp.dest('dist'));
}

gulp.task('watchify', (cb) => {
    const args = {
        entries: bundleConfig.entryPoint,
        debug: development(),
    };

    const bundler = watchify(browserify({...watchify.args, ...args}));

    bundler.on('update', () => {
        bundle(bundler);
    });

    bundler.on('log', (msg) => {
        log(`Bundle updated: ${msg}`);
    });

    return bundle(bundler);
});

gulp.task('browserify', () => {
    const bundler = browserify({
        entries: bundleConfig.entryPoint,
        debug: development(),
    });

    return bundle(bundler);
});

gulp.task('connect', (cb) => {
    connect.server({
        name: 'Bundle Server',
        root: bundleConfig.bundlePath,
        host: '0.0.0.0',
        port: 42069,
    }, cb);
});

gulp.task('default', gulp.parallel('watchify', 'connect'));
