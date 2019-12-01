export const Type = {
    INTERVAL: 0,
    TIMEOUT: 1,
};

export class DelayedAction {
    #handler = null;
    #time = null;
    #type = null;

    active = true;

    #paused = false;
    #elapsedTime = 0;

    constructor(handler, time, type) {
        this.#handler = handler;
        this.#time = time;
        this.#type = type;
    }

    tick(deltaTime) {
        if (this.#paused) {
            return;
        }

        this.#elapsedTime += deltaTime;

        if (this.#elapsedTime >= this.#time) {
            this.#handler();

            if (this.#type == Type.TIMEOUT) {
                this.active = false;
            } else {
                this.#elapsedTime -= this.#time;
            }
        }
    }

    reset() {
        this.#elapsedTime = 0;
    }

    pause() {
        this.#paused = true;
    }

    resume() {
        this.#paused = false;
    }

    clear() {
        this.active = false;
    }
}
