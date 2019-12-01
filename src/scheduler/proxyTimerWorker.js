/* eslint-env worker */

const handlers = {};

function setIntervalProxy(event) {
    const id = event.data.id;
    const time = event.data.time;

    handlers[id] = setInterval(() => {
        postMessage({'id': id});
    }, time);
}

function clearIntervalProxy(event) {
    const id = event.data.id;

    if (id in handlers) {
        clearInterval(handlers[id]);
        delete handlers[id];
    }
}

function setTimeoutProxy(event) {
    const id = event.data.id;
    const time = event.data.time;

    handlers[id] = setTimeout(() => {
        postMessage({'id': id});

        if (id in handlers) {
            delete handlers[id];
        }
    }, time);
}

function clearTimeoutProxy(event) {
    const id = event.data.id;

    if (id in handlers) {
        clearTimeout(handlers[id]);
        delete handlers[id];
    }
}

self.addEventListener('message', (event) => {
    const name = event.data.name;

    switch (name) {
    case 'setInterval':
        setIntervalProxy(event);
        break;
    case 'clearInterval':
        clearIntervalProxy(event);
        break;
    case 'setTimeout':
        setTimeoutProxy(event);
        break;
    case 'clearTimeout':
        clearTimeoutProxy(event);
        break;
    }
});
