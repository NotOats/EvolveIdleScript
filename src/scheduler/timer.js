import {DelayedAction, Type} from './delayedAction.js';
import * as proxyTimers from './proxyTimer.js';

export class Timer {
    #running = false;
    #deltaTime = 0;
    #currentTime = 0;
    #elapsedTime = 0;

    #delayed = [];
    #idleCallbackTimeout = 0;
    #intervalCallback = null;

    get running() {
        return this.#running;
    }

    constructor() {
        this.start();
    }

    start(ticksPerSecond = 30) {
        if (this.#running) {
            return;
        }

        // Reset data
        this.#deltaTime = 0;
        this.#currentTime = 0;
        this.#elapsedTime = 0;

        this.clear();

        this.#intervalCallback = proxyTimers.setInterval(
            this._tick.bind(this),
            1000 / ticksPerSecond
        );
    }

    stop() {
        if (!this.#running) {
            return;
        }

        this.#running = false;

        if (this.#intervalCallback) {
            proxyTimers.clearInterval(this.#intervalCallback);
        }
    }

    clear() {
        this.#delayed.forEach((element) => {
            element.clear();
        });

        this.#delayed = [];
    }

    setInterval(handler, time) {
        const action = new DelayedAction(handler, time, Type.INTERVAL);
        this.#delayed.push(action);
        return action;
    }

    setTimeout(handler, time) {
        const action = new DelayedAction(handler, time, Type.TIMEOUT);
        this.#delayed.push(action);
        return action;
    }

    // Private methods are currently broken with eslint-babel
    _tick() {
        // Update timers
        const newTime = performance.now();
        this.#deltaTime = newTime - this.#currentTime;
        this.#currentTime = newTime;
        this.#elapsedTime += this.#deltaTime;

        // Process actions
        let index = this.#delayed.length;

        while (index--) {
            const action = this.#delayed[index];

            if (action.active) {
                action.tick(this.#deltaTime);
            } else {
                this.#delayed.splice(index, 1);
                continue;
            }
        }
    }
}
