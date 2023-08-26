import EventDispatcher from '../base/EventDispatcher';
import { Processor } from './Processor';
import { default as Greeter } from './templates/Greeter';

export default class Terminal extends EventDispatcher {
    private processor: Processor;

    private history: string[] = [];
    private historyPtr: number = 0;
    private historyCap: number = 50;

    constructor() {
        super();
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
        this.dispatchEvent(new CustomEvent('input', { detail: message }));
    }

    submit(message: string): void {
        if (message !== null) {
            this.history.push(message);
            this.historyPtr = this.history.length;
            if (this.history.length > this.historyCap) this.history.shift();
            this.dispatchEvent(new CustomEvent('output', { detail: message }));
        }

        const result = this.processor.process(message);
        this.dispatchEvent(new CustomEvent('input', { detail: result }));
    }

    start(): void {
        this.processor.process();
    }

    write(text: string): void {
        this.dispatchEvent(new CustomEvent('output', { detail: text }));
    }

    read(): string {
        return 'TODO';
    }
}
