// Buefy
import Vue from 'vue';
import Buefy from 'buefy';

// Components
import * as devToolbar from './devToolbar.js';

// Utils
import {injectStyle} from '../utils/domEditor.js';

export function initUserInterface() {
    // From https://buefy.org/documentation/start/
    // For some reason this isn't loaded by default in the game
    injectStyle('https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css');

    // Setup Buefy
    Vue.use(Buefy);

    // Setup ui components
    devToolbar.initialize();

    // Load dev tools, doesn't work with external vue
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue;
}
