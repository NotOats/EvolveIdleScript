import connect from 'gulp-connect';
import gulp from 'gulp';
import path from 'path';
import requireDir from 'require-dir';

import { config } from './src/config.js';

requireDir('./gulp_tasks', { recurse:true });

/*
 * Build everything
 */
gulp.task('build', gulp.series('browserify'));

/*
 * Setup gulp to watch for files changes
 */
gulp.task('watch', gulp.series('build', () => {
    let index = path.join(config.entryPointPath, '*.js');
    
    gulp.watch(index, gulp.series('build'));
}));

/*
 * Run the test web server, this requires the build task to run first
 */
gulp.task('server', (callback) => {
    connect.server({
        name: 'Bundle Server',
        root: config.bundlePath,
        host: '0.0.0.0',
        port: 42069,
    }, callback);
});

gulp.task('default', gulp.parallel('watch', 'server'));