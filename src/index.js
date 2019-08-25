import {BehaviorTree, Selector} from 'behaviortree';

// TODO: Add directory requiring that supports browserify, require-globify?
import './tasks/autoEvolution.js';
import './tasks/autoResourceFarm.js';

/*
 * Script entry point, sets up unsafewindow.game.global
 */
function userscriptEntryPoint() {
    console.log(unsafeWindow.game);

    let bTree = new BehaviorTree({
        tree : new Selector({
            nodes: [
                'autoEvolution',
                'autoResourceFarm'
            ]
        }),
        blackboard: {
            game: unsafeWindow.game,
        }
    });

    // Tick at 60fps
    setInterval(function() { bTree.step(); }, 1000/60);
}

unsafeWindow.addEventListener('customModuleAdded', userscriptEntryPoint);

$(document).ready(function() {
    let injectScript = `
import { global } from './vars.js';
import { actions } from './actions.js';
import { races } from './races.js';

window.game =  {
    global: global,
    actions: actions,
    races: races
};

window.dispatchEvent(new CustomEvent('customModuleAdded'));
`;

    $('<script>')
    .attr('type', 'module')
    .text(injectScript)
    .appendTo('head');
});
