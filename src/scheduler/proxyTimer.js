const fs = require('fs');

// Proxy info
const handlers = {};
const maxId = Number.MAX_SAFE_INTEGER;
let lastId = 0;

function generateId() {
    const start = lastId;
    while (lastId in handlers) {
        lastId++;

        if (lastId == maxId) {
            lastId = 0; // Roll over
        }

        if (lastId == start) {
            return -1; // Ids full
        }
    }

    return lastId;
}

// Start Web Worker
const workerSource = fs.readFileSync(__dirname + '/proxyTimerWorker.js');
const workerUrl = URL.createObjectURL(new Blob([workerSource]));
const worker = new Worker(workerUrl);

worker.addEventListener('message', (event) => {
    const id = event.data.id;

    if (!(id in handlers)) {
        console.log('ProxyTimer: Invalid id of ' + id);
        return;
    }

    let callback = handlers[id].callback;
    const parameters = handlers[id].parameters;

    if (typeof callback === 'string') {
        try {
            callback = new Function(callback);
        } catch (error) {
            console.log('ProxyTimer: Failed to parse callback string id #' +
                        id);
            console.error(error);
        }
    }

    if (typeof callback === 'function') {
        callback.apply(window, parameters);
    }
});

worker.addEventListener('error', (event) => {
    console.error(event);
});

// Setup proxy functions
export function setInterval(callback, time, ...args) {
    const id = generateId();
    if (id == -1) {
        return false;
    }

    handlers[id] = {
        callback: callback,
        parameters: args,
    };

    worker.postMessage({
        name: 'setInterval',
        id: id,
        time: time,
    });
}

export function clearInterval(id) {
    if (id in handlers) {
        delete handlers[id];

        worker.postMessage({
            name: 'clearInterval',
            id: id,
        });
    }
}
