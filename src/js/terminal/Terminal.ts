import EventDispatcher from '../base/EventDispatcher';
import { Processor } from './Processor';
import TerminalView from './TerminalView';
import { default as Greeter } from './templates/Greeter';

export default class Terminal extends EventDispatcher {
    private processor: Processor;
    private view: TerminalView;

    private history: string[] = [];
    private historyPtr: number = 0;
    private historyCap: number = 50;

    private overrideInputFlow: boolean = false;

    constructor(view: TerminalView) {
        super();
        this.view = view;
        this.processor = new Processor(this, Greeter);
    }

    prevHistory() {
        this.historyPtr = Math.max(0, this.historyPtr - 1);

        if (this.historyPtr == this.history.length) return '';

        return this.history[this.historyPtr];
    }

    nextHistory() {
        this.historyPtr = Math.min(this.historyPtr + 1, this.history.length);

        if (this.historyPtr == this.history.length) return '';

        return this.history[this.historyPtr];
    }

    output(message: string): void {
        this.history.push(message);
        this.historyPtr = this.history.length;
        if (this.history.length > this.historyCap) this.history.shift();

        this.dispatchEvent(new CustomEvent('output', { detail: message }));
    }

    input(message: string): void {
        console.trace('input');
        this.dispatchEvent(new CustomEvent('input', { detail: message }));
    }

    submit(message: string): void {
        if (message !== null) {
            this.history.push(message);
            this.historyPtr = this.history.length;
            if (this.history.length > this.historyCap) this.history.shift();
            this.dispatchEvent(new CustomEvent('input', { detail: message }));
        }

        if (this.overrideInputFlow) {
            this.overrideInputFlow = false;
            return;
        }

        this.processor.process(message);
    }

    start(): void {
        if (this.overrideInputFlow) {
            this.overrideInputFlow = false;
            return;
        }

        this.processor.process();
    }

    async write(text: string): Promise<void> {
        console.log('Terminal write', text);
        this.dispatchEvent(new CustomEvent('output', { detail: text.toString() }));

        return new Promise((resolve) => {
            const printDoneHandler = (e: Event) => {
                let printedText: string = (e as CustomEvent).detail;
                if (printedText === text) {
                    this.view.removeEventListener('printDone', printDoneHandler);
                    resolve();
                }
            };

            this.view.addEventListener('printDone', printDoneHandler);
        });
    }

    async read(): Promise<string> {
        console.log('Terminal read');
        this.overrideInputFlow = true;
        return new Promise((resolve) =>
            this.addEventListener(
                'input',
                (e) => {
                    return resolve((e as CustomEvent).detail);
                },
                true
            )
        );
    }
}
