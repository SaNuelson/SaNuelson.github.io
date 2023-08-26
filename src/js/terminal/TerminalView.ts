import Terminal from './Terminal';

type PrintInfo = {
    target: HTMLElement;
    content: string;
    index: number;
    interval: NodeJS.Timeout | undefined;
};

/**
 * Creates a binding between a Terminal model and its interface.
 */
export default class TerminalView {
    terminal: Terminal;

    /** Input for this terminal view */
    input: HTMLInputElement;

    /** HTML Element where terminal output is shown. */
    output: HTMLElement;

    /** Custom object holding information regarding current output. */
    private _currentPrint: PrintInfo | null;

    /** Flag whether view is enabled. If not, no events are sent. */
    private _enabled: boolean = false;
    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        if (this._enabled === value) return;

        this._enabled = value;
    }

    /** @type {boolean} Flag whether accepting input */
    _expectsInput: boolean = false;
    get expectsInput() {
        return this._expectsInput;
    }
    set expectsInput(value) {
        if (this._expectsInput === value) return;
        this._expectsInput = value;
        this.input.disabled = !value;
    }

    /** @type {EventDispatcher} Event triggered when output  */

    constructor(input: HTMLInputElement, output: HTMLElement) {
        this.terminal = new Terminal();
        this.input = input;
        this.output = output;

        this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
        this.terminal.addEventListener('input', this.onTerminalInput.bind(this));
        this.terminal.addEventListener('output', this.onTerminalOutput.bind(this));

        this._currentPrint = null;
        this.expectsInput = false;
    }

    private onInputKeyDown(e: KeyboardEvent): void {
        switch (e.key) {
            case 'Enter':
                this.terminal.submit((e.target as HTMLInputElement).value);
                this.input.value = '';
                break;
            case 'Up':
            case 'ArrowUp':
                e.preventDefault();
                this.input.value = this.terminal.prevHistory();
                break;
            case 'Down':
            case 'ArrowDown':
                e.preventDefault();
                this.input.value = this.terminal.nextHistory();
                break;
        }
    }

    private onTerminalInput(event: Event): void {
        const message = (event as CustomEvent).detail.message;
        const p = document.createElement('p');
        p.innerHTML = '&gt;' + message;
        this.output.appendChild(p);
    }

    private onTerminalOutput(event: Event): void {
        const message = (event as CustomEvent).detail.message;
        const p = document.createElement('p');
        this.printOut(p, message, 50, true);
        this.output.appendChild(p);
    }

    printOut(element: HTMLElement, text: string, delta: number, textAware: boolean = false) {
        if (this._currentPrint !== null) {
            clearInterval(this._currentPrint.interval);
            this._currentPrint.target.innerHTML += this._currentPrint.content.slice(this._currentPrint.index);
            this._currentPrint = null;
        }
        this._currentPrint = {
            target: element,
            content: text,
            index: 0,
            interval: undefined,
        };

        // Fault check
        if (text === null || text === undefined) {
            console.trace('printOut text = ' + text);
            text = '';
        }

        let delay = 0;
        let interval = setInterval(() => {
            if (!this._currentPrint) {
                return;
            }

            if (this._currentPrint.index < text.length) {
                let char = text[this._currentPrint.index];

                // replace html-conflicting chars
                if (char === '<') char = '&lt;';
                else if (char === '>') char = '&gt;';
                else if (char === '&') char = '&amp;';
                else if (char === '"') char = '&quot;';
                else if (char === "'") char = '&#39;';
                else if (char === '`') char = '&#96;';
                else if (char === '\n') char = '<br />';
                else if (char === '\r') char = '<br />';
                else if (char === '\t') char = '&nbsp;&nbsp;&nbsp;&nbsp;';
                else if (char === '\b') char = '&nbsp;&nbsp;&nbsp;';
                else if (char === '\f') char = '&nbsp;';
                else if (char === '\v') char = '&nbsp;&nbsp;';
                else if (char === '\u00A0') char = '&nbsp;';
                else if (char === '\u2028') char = '&nbsp;';
                else if (char === '\u2029') char = '&nbsp;';

                if (textAware) {
                    switch (char) {
                        case ',':
                            if (delay >= 2) break;
                            delay++;
                            return;
                        case '.':
                            if (delay >= 4) break;
                            delay++;
                            return;
                    }
                }
                element.innerHTML += char;
                delay = 0;
                this._currentPrint.index++;
            } else {
                clearInterval(interval);
                this._currentPrint = null;
            }
        }, delta);
        this._currentPrint.interval = interval;
    }
}
