import EventDispatcher, { Callback } from './base/EventDispatcher.js';

// Initialization
let isInit = false;
export function init() {
    if (isInit) {
        return;
    }
    isInit = true;

    Settings.crtEffect.init();
}

/** Wrapper around settings option that can be potentially changed and can be saved into / loaded from local storage */
class SettingsOption extends EventDispatcher {
    /** Handle for option used in local storage */
    #name: string;
    /** Value saved for option */
    #value: any;
    /**  Flag whether item is initialized, i.e., loaded from local storage */
    #isInit: boolean = false;
    /** Flag whether value should be saved and/or loaded from/to local storage */
    #saved: boolean = true;

    constructor(name: string, value: any, saved: boolean = true) {
        super();
        this.#name = name;
        this.#value = value;
        this.#saved = saved;
    }

    init() {
        if (this.#isInit) {
            return;
        }

        this.#isInit = true;
        if (this.#saved && localStorage.getItem(this.#name) !== null) {
            this.value = localStorage.getItem(this.#name) === 'true';
        }

        super.dispatchEvent(new CustomEvent('change', { detail: this }));
    }

    set value(value: any) {
        if (Settings.debug.value) console.log(`${this.name} set value to ${value}`);

        if (this.#value === value) {
            return;
        }

        this.#value = value;
        if (this.#saved) {
            localStorage.setItem(this.#name, this.#value);
        }
        super.dispatchEvent(new CustomEvent('change', { detail: this }));
    }

    get value(): any {
        return this.#value;
    }

    get name(): string {
        return this.#name;
    }
}

// Settings singleton
export const Settings: { [key: string]: SettingsOption } = {
    enabled: new SettingsOption('enabled', false, false),
    crtEffect: new SettingsOption('crtEffect', true),
    debug: new SettingsOption('debug', true),
    sound: new SettingsOption('sound', true),
    soundVolume: new SettingsOption('soundVolume', 0.5),
};

const debugLogCallbacks: Callback[] = [];
Settings.debug.addEventListener(() => {
    if (Settings.debug.value) {
        for (const key in Settings) {
            const setting = Settings[key];
            const logCallback = (e: Event) => console.log(`${key}.dispatchEvent(${e})`);
            debugLogCallbacks.push(logCallback);
            setting.addEventListener(logCallback);
        }
    } else {
        for (const key in Settings) {
            const setting = Settings[key];
            const logCallback = debugLogCallbacks.shift() as Callback;
            setting.removeEventListener(logCallback);
        }
    }
});
