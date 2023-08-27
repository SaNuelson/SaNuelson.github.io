export type Callback = (event: Event) => void;

/**
 * Simple event dispatcher with capability to be subscribed to, analogically to HTMLElements.
 */
export default class EventDispatcher {
    private listeners: { [eventType: string]: Array<Callback> } = {};
    private oneShots: { [eventType: string]: Array<Callback> } = {};
    private defaultListeners: Array<Callback> = [];
    private defaultOneShots: Array<Callback> = [];

    constructor() {}

    addEventListener(type: string, listener: Callback, oneShot: boolean): void;
    addEventListener(type: string, listener: Callback): void;
    addEventListener(listener: Callback, oneShot: boolean): void;
    addEventListener(listener: Callback): void;
    addEventListener(a: Callback | string, b?: Callback | boolean, c?: boolean): void {
        if (typeof a === 'string' && typeof b === 'function') {
            const type = a;
            const listener = b;
            const oneShot = !!c;

            if (oneShot) {
                if (!this.oneShots[type]) {
                    this.oneShots[type] = [];
                }

                if (this.oneShots[type].includes(listener)) {
                    return;
                }

                this.oneShots[type].push(listener);
            } else {
                if (!this.listeners[type]) {
                    this.listeners[type] = [];
                }

                if (this.listeners[type].includes(listener)) {
                    return;
                }

                this.listeners[type].push(listener);
            }
        } else if (typeof a === 'function') {
            const listener = a;
            const oneShot = !!b;

            if (oneShot) {
                if (this.defaultOneShots.includes(listener)) {
                    return;
                }

                this.defaultOneShots.push(listener);
            } else {
                if (this.defaultListeners.includes(listener)) {
                    return;
                }

                this.defaultListeners.push(listener);
            }
        } else {
            throw new Error('Invalid arguments');
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

        if (!this.listeners[type].includes(listener)) {
            this.listeners[type].splice(this.listeners[type].indexOf(listener), 1);
        }
    }

    dispatchEvent(event: Event) {
        // Dispatch to targetted listeners
        if (this.listeners[event.type]) {
            this.listeners[event.type].forEach((listener) => listener(event));
        }

        if (this.oneShots[event.type]) {
            this.oneShots[event.type].forEach((listener) => listener(event));
            delete this.oneShots[event.type];
        }

        // Dispatch to general listeners
        this.defaultListeners.forEach((listener) => listener(event));

        this.defaultOneShots.forEach((listener) => listener(event));
        this.defaultOneShots = [];
    }
}
