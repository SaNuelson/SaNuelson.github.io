export type Callback = (event: Event) => void;

/**
 * Simple event dispatcher with capability to be subscribed to, analogically to HTMLElements.
 */
export default class EventDispatcher {
    private listeners: { [eventType: string]: Array<Callback> } = {};
    private defaultListeners: Array<Callback> = [];

    constructor() {}

    addEventListener(type: string, listener: Callback): void;
    addEventListener(listener: Callback): void;
    addEventListener(type: Callback | string, listener?: Callback): void {
        if (typeof type === 'function') {
            this.defaultListeners.push(type);
            return;
        }

        if (listener === undefined) {
            throw new Error('Missing listener');
        }

        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }

        if (this.listeners[type].includes(listener)) {
            this.listeners[type].push(listener);
        }
    }

    removeEventListener(type: string, listener: Callback): void;
    removeEventListener(listener: Callback): void;
    removeEventListener(type: string | Callback, listener?: Callback) {
        if (typeof type === 'function') {
            this.defaultListeners.splice(this.defaultListeners.indexOf(type), 1);
            return;
        }

        if (listener === undefined) {
            throw new Error('Missing listener');
        }

        if (this.listeners[type].includes(listener)) {
            this.listeners[type].splice(this.listeners[type].indexOf(listener), 1);
        }
    }

    dispatchEvent(event: Event) {
        // Dispatch to targetted listeners
        if (this.listeners[event.type]) {
            this.listeners[event.type].forEach((listener) => listener(event));
        }

        // Dispatch to general listeners
        this.defaultListeners.forEach((listener) => listener(event));
    }
}
