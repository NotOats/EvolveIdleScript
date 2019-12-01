import {Timer} from './scheduler/timer.js';

/*
 * Userscript entry point
 * By this point window.game will be setup
 */
window.addEventListener('startUserScript', userscriptEntryPoint);

function userscriptEntryPoint() {
    console.log(window.game);

    const timer = new Timer();
    timer.setInterval(function() {

    }, 1000/60);

    // let vars = require('./evolve/vars.js');
    // console.log(vars);
}

// Wrap this in a string to avoid browserify messing with dynamic import
new Function(`
window.game = {};

let imports = ['vars', 'actions', 'races', 'resources'];

let promises = imports.map(name => {
    return import('./' + name + '.js').then(m => window.game[name] = m);
});

Promise.all(promises).then(_ => window.dispatchEvent(new CustomEvent('startUserScript')))
`)();
