// Buefy
import Vue from 'vue';
import Buefy from 'buefy';

// Utils
import {injectStyle} from '../utils/domEditor.js';

class UserInterface {
    #elements = [];

    /**
     * Registers a vue
     * @param {Object} vue - The vue to create
     * @param {String} id - The element id to mount to
     */
    registerVue(vue, id) {
        // Pull id from vue if needed/available
        if (id == undefined && 'initialize' in vue) {
            id = vue.initialize();
        }

        id = (id[0] == '#') ? id : '#' + id;

        this.#elements.push(() => {
            new Vue({
                render: (h) => h(vue),
            }).$mount(id);
        });
    }

    initialize() {
        // From https://buefy.org/documentation/start/
        // For some reason this isn't loaded by default in the game
        injectStyle('https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css');

        // Setup Buefy
        Vue.use(Buefy);

        // Load dev tools, doesn't work with external vue
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue;

        // Initialize UI Elements
        this.#elements.forEach((x) => x());
    }
}

export const userInterface = new UserInterface();
