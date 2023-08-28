import EventDispatcher from '../base/EventDispatcher';
import Terminal from './Terminal';

type PrintInfo = {
    target: HTMLElement;
    content: string;
    delta: number;
    index: number;
    interval: NodeJS.Timeout | undefined;
};

/**
 * Creates a binding between a Terminal model and its interface.
 */
export default class TerminalView extends EventDispatcher {
    terminal: Terminal;

    /** Input for this terminal view */
    input: HTMLInputElement;

    /** HTML Element where terminal output is shown. */
    output: HTMLElement;

    /** Custom object holding information regarding current output. */
    private printStack: PrintInfo[] = [];

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
        super();

        this.terminal = new Terminal(this);
        this.input = input;
        this.output = output;

        this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
        this.terminal.addEventListener('input', this.onTerminalInput.bind(this));
        this.terminal.addEventListener('output', this.onTerminalOutput.bind(this));

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
        const message = (event as CustomEvent).detail;
        const p = document.createElement('p');
        this.printOut(p, `>${message}`, 0, false, true);
        this.output.appendChild(p);
    }

    private onTerminalOutput(event: Event): void {
        const message = (event as CustomEvent).detail;
        const p = document.createElement('p');
        this.printOut(p, message, 50, true);
        this.output.appendChild(p);
    }

    parseRichTest(text: string): string[] {
        let parsed: string[] = [];
        while (text.length > 0) {
            if (text[0] === '<') {
                let endIdx = text.indexOf('>', 1);
                parsed.push(text.slice(0, endIdx));
                text = text.slice(endIdx + 1);
            } else {
                parsed.push(text[0]);
                text = text.slice(1);
            }
        }
        return parsed;
    }

    /**
     * Enqueue a printing order for a message in the terminal view.
     * @param element HTML element (i.e., p) in which to print the message.
     * @param text Text to print.
     * @param delta Time in milliseconds between printing each character.
     * @param textAware If true, commas and dots will be printed with a delay (2 and 4 times the delta respectively), as to simulate speech.
     * @param flush If true, any currently enqueued messages will be printed immediately.
     */
    printOut(
        element: HTMLElement,
        text: string,
        delta: number,
        textAware: boolean = false,
        flush: boolean = false
    ): void {
        // Fault check
        if (text == null) {
            console.trace('printOut text = ' + text);
            text = '';
        }

        if (flush) {
            while (this.printStack.length > 0) {
                let printInfo = this.printStack.shift() as PrintInfo;
                clearInterval(printInfo.interval);
                printInfo.target.innerText = printInfo.content;
            }
        }

        let printInfo: PrintInfo = {
            target: element,
            content: text,
            delta: delta,
            index: 0,
            interval: undefined,
        };
        this.printStack.push(printInfo);

        // Helper counter to handle text-aware delays in special characters.
        let delay = 0;

        let interval = setInterval(() => {
            let order = this.printStack.indexOf(printInfo);
            if (order === -1) {
                console.trace('printOut entry not in queue', printInfo);
                clearInterval(interval);
                return;
            } else if (order > 0) {
                // Not first in line, wait
                return;
            }

            if (printInfo.index < text.length) {
                let char = text[printInfo.index];

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
                printInfo.index++;
            } else {
                clearInterval(interval);
                let finishedPrint = this.printStack.shift();
                this.dispatchEvent(new CustomEvent('printDone', { detail: finishedPrint }));
            }
        }, delta);
        printInfo.interval = interval;
    }
}
