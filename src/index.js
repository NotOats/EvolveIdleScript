import {Timer} from './scheduler/timer.js';
import {userInterface} from './ui';
import devToolbar from './ui/components/devToolbar.vue';

import {parseActions, ActionType} from './data/actions.js';

const timer = new Timer();

timer.setTimeout(() => {
    Object.values(ActionType.properties).forEach((x) => {
        console.log(x.name + ': ' + parseActions(x.value)?.map((x) => x.title)?.join(', '));
    });
}, 2000);

timer.setTimeout(() => {
    userInterface.registerVue(devToolbar);
    userInterface.initialize();
}, 1000);
