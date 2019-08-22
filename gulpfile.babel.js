import gulp from 'gulp';
import { bundleConfig } from './src/config.js';

// Load gulp plugins
const plugins = require('gulp-load-plugins')({
    overridePattern: false,
    pattern: [ 'vinyl-*' ],
    rename : {
        'vinyl-buffer': 'buffer',
        'vinyl-source-stream': 'source'
    }
});

// Load gulp tasks
require('require-dir')('./gulp_tasks', { recurse: true })

/*
 * Gulp Tasks
 */
gulp.task('build', gulp.series('browserify'));

gulp.task('watch', gulp.series('build', 'browserify-watch'));

gulp.task('server', (callback) => {
    plugins.connect.server({
        name: 'Bundle Server',
        root: bundleConfig.bundlePath,
        host: '0.0.0.0',
        port: 42069,
    }, callback);
});

gulp.task('default', gulp.parallel('watch', 'server'));