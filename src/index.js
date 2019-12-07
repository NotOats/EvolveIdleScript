import {Timer} from './scheduler/timer.js';
import {userInterface} from './ui';
import devToolbar from './ui/components/devToolbar.vue';

const timer = new Timer();

timer.setTimeout(() => {
    userInterface.registerVue(devToolbar);
    userInterface.initialize();
}, 1000);
