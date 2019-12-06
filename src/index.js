import {Timer} from './scheduler/timer.js';
import {initUserInterface} from './ui';

// window.addEventListener('load', start);
start();

function start() {
    const timer = new Timer();

    /*
    let start = null;
    let counter = 0;

    const interval = timer.setInterval(() => {
        if (start === null) {
            start = performance.now();
            return;
        }

        const time = (performance.now() - start) / 1000;
        const average = ++counter / time;

        console.log(`TICK: ${counter} calls @ ${average.toFixed(6)} calls/s`);

        if (counter == 5) {
            interval.clear();
            console.log(window.evolve);
        }
    }, 1000);
    */

    timer.setTimeout(() => {
        initUserInterface();
    }, 1000);
}
