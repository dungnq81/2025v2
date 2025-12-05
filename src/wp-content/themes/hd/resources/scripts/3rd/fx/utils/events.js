// utils/events.js

const listeners = new Map();
export default {
    on(event, cb) {
        if (!listeners.has(event)) listeners.set(event, []);
        listeners.get(event).push(cb);
    },
    off(event, cb) {
        if (!listeners.has(event)) return;
        if (!cb) {
            listeners.delete(event);
            return;
        }
        const arr = listeners.get(event).filter(f => f !== cb);
        listeners.set(event, arr);
    },
    emit(event, payload = {}) {
        if (!listeners.has(event)) return;
        listeners.get(event).forEach(cb => {
            try {
                cb(payload);
            } catch (e) {
                console.error(e);
            }
        });
    }
};
