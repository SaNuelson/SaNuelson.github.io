import { Settings } from "../Settings.js";

/**
 * Simple event dispatcher with capability to be subscribed to, analogically to HTMLElements.
 */
export default class EventDispatcher {
    constructor() {
        this.__listeners = {};
        this.__defaultListeners = [];
    }

    addEventListener(type, listener) {
        if (listener === undefined) 
        {
            this.__defaultListeners.push(type);
            return;
        }

        if (!this.__listeners[type]) 
            this.__listeners[type] = [];

        if (this.__listeners[type].indexOf(listener) === -1)
            this.__listeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if (!this.__listeners[type]) 
            return;

        if (this.__listeners[type].indexOf(listener)!== -1)
            this.__listeners[type].splice(this.__listeners[type].indexOf(listener), 1);
    }

    dispatchEvent(event) {
        // Dispatch to targetted listeners
        if (this.__listeners[event.type]) {
            for (let i = 0; i < this.__listeners[event.type].length; i++) {
                if (Settings.debug.value)
                    console.log(`EventDispatcher.dispatchEvent(${event.type}): ${this.__listeners[event.type][i]}`);
                this.__listeners[event.type][i](event);
            }
        }

        // Dispatch to general listeners
        for (let i = 0; i < this.__defaultListeners.length; i++) {
            if (Settings.debug.value)
                console.log(`EventDispatcher.dispatchEvent(${event.type}): ${this.__defaultListeners[i]}`);
            this.__defaultListeners[i](event);
        }
    }
}