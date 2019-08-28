export const Type = {
    INTERVAL: 0,
    TIMEOUT: 1
}

export class DelayedAction {
    constructor(handler, time, type) {
        this.handler = handler;
        this.time = time;
        this.type = type;

        this.paused = false;
        this.active = true;

        this.elapsedTime = 0;
    }

    tick(deltaTime) {
        if(this.paused) {
            return;
        }

        this.elapsedTime += deltaTime;

        // Execute
        if(this.elapsedTime >= this.time) {
            this.handler();

            if(this.type == Type.TIMEOUT) {
                this.active = false;
            } else {
                this.elapsedTime -= this.time;
            }
        }
    }

    reset() {
        this.elapsedTime = 0;
    }

    pause() {
        this.paused = true;
    }

    resume () {
        this.paused = false;
    }

    clear() {
        this.active = false;
    }
}