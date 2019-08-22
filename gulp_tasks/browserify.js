import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import environments from 'gulp-environments';
import fs from 'fs';
import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import * as userscript from 'userscript-meta';
const gulpheader = require('gulp-header');

import { config, userscriptHeader } from '../src/config.js';

// Environment
var development = environments.development;
var production = environments.production;

/*
 * Bundles scripts using browserify
 */
gulp.task('browserify', () => {
    return browserify({
        entries: path.join(config.entryPointPath, config.entryPointName),
        debug: development()
    })
    .bundle()
    .on('error', function (err) {
        gutil.log(err.message);
        this.emit('end');
    })
    .pipe(source(config.bundleName))
    .pipe(buffer())
    .pipe(production(uglify()))
    .pipe(createHeader(userscriptHeader))
    .pipe(gulp.dest(config.bundlePath));
});


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

function createHeader(overwriteObj) {
    let header = trimFalsyLeaves({
        ...generateDefaultHeader(),
        ...(typeof overwriteObj === 'object' ? overwriteObj : {})
    });

    let headerString = userscript.stringify(header);
    return gulpheader(headerString);
}