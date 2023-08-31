import EventDispatcher from '../base/EventDispatcher';
import { sanitizeHtml, splitHtml } from '../base/Util';
import Terminal from './Terminal';

type PrintInfo = {
    target: HTMLElement;
    originalText: string;
    content: string[];
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
        this.printOut(p, message, 20, true);
        this.output.appendChild(p);
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
            console.trace(`printOut text = ${text}`);
            text = '';
        }

        if (flush) {
            while (this.printStack.length > 0) {
                let printInfo = this.printStack.shift() as PrintInfo;
                clearInterval(printInfo.interval);
                printInfo.target.innerHTML = printInfo.content.join('');
            }
        }

        let printInfo: PrintInfo = {
            target: element,
            originalText: text,
            content: splitHtml(text).map((c) => (c.length === 1 ? sanitizeHtml(c) : c)),
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

            if (printInfo.index < printInfo.content.length) {
                const char = printInfo.content[printInfo.index];
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
                element.innerHTML = printInfo.content.slice(0, printInfo.index + 1).join('');
                delay = 0;
                printInfo.index++;
            } else {
                clearInterval(interval);
                let finishedPrint = this.printStack.shift();
                this.dispatchEvent(new CustomEvent('printDone', { detail: printInfo.originalText }));
            }
        }, delta);
        printInfo.interval = interval;
    }
}
