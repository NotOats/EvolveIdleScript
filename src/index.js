import {Timer} from './scheduler/timer.js';

window.addEventListener('load', start);

function start() {
    let start = null;
    let counter = 0;

    const timer = new Timer();
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
}
