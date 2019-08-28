import {DelayedAction, Type} from './delayedAction.js';

// polyfill requestIdleCallback
window.requestIdleCallback = window.requestIdleCallback || function(handler) {
    let startTime = window.performance.now();

    return setTimeout(function() {
        handler({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50.0 - (window.performance.now() - startTime))
            }
        });
    }, 1);
}

// polyfill cancelIdleCallback
window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
}

export class Timer {
    constructor() {
        this.start();
    }

    start() {
        this.deltaTime = 0;
        this.currentTime = 0;
        this.elapsedTime = 0;
        this.running = true;

        this._delayed = [];

        this._idleCallbackTimeout = 1000/30; // Target at minimum 30 fps, every ~33ms

        this._interval = window.requestIdleCallback(this.tick.bind(this), {timeout: this._idleCallbackTimeout});
    }

    stop() {
        this.running = false;

        if(this._interval) {
            window.cancelIdleCallback(this._interval);
        }
    }

    tick (deadline) {
        let newTime = window.performance.now();

        this.deltaTime = newTime - this.currentTime;
        this.currentTime = newTime;
        this.elapsedTime += this.deltaTime;

        let index = this._delayed.length;

        // TODO: Figure out minimum time required to do task
        // TODO: Add in deadline.didTimeout support. Maybe only do x number of tasks in queue?
        // TODO: Save index when we run out of time so it can be resumed from there
        while(index-- && deadline.timeRemaining() > 0) {
            const delayed = this._delayed[index];

            if(delayed.active) {
                delayed.tick(this.deltaTime);
            } else {
                this._delayed.splice(index, 1);
                continue;
            }
        }

        // Restart requestIdleCallback
        this._interval = window.requestIdleCallback(this.tick.bind(this), {timeout: this._idleCallbackTimeout});
    }

    setInterval(handler, time) {
        let delayed = new DelayedAction(handler, time, Type.INTERVAL);
        this._delayed.push(delayed);
        return delayed;
    }

    setTimeout(handler, time) {
        let delayed = new DelayedAction(handler, time, Type.TIMEOUT);
        this._delayed.push(delayed);
        return delayed;
    }

    clear() {
        this._delayed.forEach(function(element) {
            element.clear();
        })

        this._delayed = [];
    }
}