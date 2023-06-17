import EventDispatcher from './base/EventDispatcher.js';

// Initialization
let isInit = false;
export function init() {
    if (isInit)
    {
        return;
    }
    isInit = true;

    Settings.crtEffect.init();
};

class SettingsOption extends EventDispatcher {
    /** @type {string} */
    #name;
    /** @type {any} */
    #value;
    /** @type {boolean} */
    #isInit = false;

    constructor(name, value) {
        super();
        this.#name = name;
        this.#value = value;
    }

    init() {
        if (this.#isInit)
        {
            return;
        }
        
        this.#isInit = true;
        if (localStorage.getItem(this.#name) !== null) {
            this.value = localStorage.getItem(this.#name) === 'true';
        }
    }

    set value(value) {
        if (Settings.debug.value)
            console.log(`${this.name} set value to ${value}`);

        if (this.#value === value)
        {
            return;
        }

        this.#value = value;
        localStorage.setItem(this.#name, this.#value);
        super.dispatchEvent(new CustomEvent('change', {detail: this}));
    }

    get value() {
        return this.#value;
    }

    get name() {
        return this.#name;
    }
}

// Settings singleton
export const Settings = {
    crtEffect: new SettingsOption('crtEffect', true),
    debug: new SettingsOption('debug', true),
    sound: new SettingsOption('sound', true),
    soundVolume: new SettingsOption('soundVolume', 0.5),
};
