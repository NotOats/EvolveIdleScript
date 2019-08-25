import browserify from 'browserify';
import fs from 'fs';
import gulp from 'gulp';
import path from 'path';
import * as userscript from 'userscript-meta';
import { bundleConfig, userscriptConfig } from '../src/config.js';

// Load gulp plugins
const plugins = require('gulp-load-plugins')({
    overridePattern: false,
    pattern: [ 'vinyl-*' ],
    rename : {
        'vinyl-buffer': 'buffer',
        'vinyl-source-stream': 'source'
    }
});

/*
 * Tasks
 */
gulp.task('browserify', () => {
    let development = plugins.environments.development;
    let production = plugins.environments.production;
    let entryPoint = path.join(bundleConfig.entryPointPath, bundleConfig.entryPointName)
    let headerString = createHeaderString(userscriptConfig);

    return browserify({
        entries: entryPoint,
        debug: development()
    })
    .bundle()
    .on('error', function (err) {
        plugins.util.log(err.message);
        this.emit('end');
    })
    .pipe(plugins.source(bundleConfig.bundleName))
    .pipe(plugins.buffer())
    .pipe(production(plugins.uglify()))
    .pipe(plugins.header(headerString))
    .pipe(gulp.dest(bundleConfig.bundlePath));
});

gulp.task('browserify-watch', () => {
    let index = path.join(bundleConfig.entryPointPath, '**/*.js');
    
    gulp.watch(index, gulp.series('browserify'));
})

/*
 * Userscript Header Generation
 */
function generateDefaultHeader() {
    let packageJsonFile = path.resolve('package.json');
    let packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));

    return {
        name: packageJson.name || '',
        version: packageJson.version || '',
        author: packageJson.author || '',
        description: packageJson.description || '',
        homepage: packageJson.homepage || '',
        supportURL: typeof packageJson.bugs === 'string' ? packageJson.bugs : '',
        match: '*://*/*'
    };
}

function trimFalsyLeaves (obj) {
    if (Array.isArray(obj)) {
        const filtered = obj.filter(Boolean)
        return filtered.length > 0 ? filtered : undefined;
    }
    if (typeof obj === 'string') {
        return obj.trim() || undefined;
    }
    if (typeof obj === 'object') {
        const filtered = Object.entries(obj)
            .filter(([ , value ]) => Boolean(trimFalsyLeaves(value)))
        return filtered.length > 0 ? filtered.reduce((newObj, [ key, value ]) => {
            newObj[key] = value
            return newObj
        }, {}) : undefined;
    }

    return obj;
}

let devBuildNumber = 0;
function createHeaderString(overwriteObj) {
    let defaultHeader = generateDefaultHeader();
    
    if(plugins.environments.development()) {
        defaultHeader.version = `${defaultHeader.version}-build.[${devBuildNumber}]`;
    }

    let header = trimFalsyLeaves({
        ...defaultHeader,
        ...(typeof overwriteObj === 'object' ? overwriteObj : {}),
    });

    devBuildNumber++;

    return userscript.stringify(header);
}