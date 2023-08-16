import { Processor, getGreeter } from "./Processor.js";

export default class Terminal {
    constructor() {
        this.inputReceivedCallbacks = [];
        this.outputSentCallbacks = [];
        this.processor = getGreeter(this);
        this.processor.terminal = this;
        this.history = [];
        this.historyPtr = 0;
        this.historyCap = 50;
    }

    onInputReceived(callback) {
        this.inputReceivedCallbacks.push(callback);
    }
    
    onOutputSent(callback) {
        this.outputSentCallbacks.push(callback);
    }

    prevHistory() {
        this.historyPtr = Math.max(0, this.historyPtr - 1);

        if (this.historyPtr == this.history.length)
            return '';

        return this.history[this.historyPtr];
    }

    nextHistory() {
        this.historyPtr = Math.min(this.historyPtr + 1, this.history.length);

        if (this.historyPtr == this.history.length)
            return '';

        return this.history[this.historyPtr];
    }

    receive(message) {
        this.history.push(message);
        this.historyPtr = this.history.length;
        if (this.history.length > this.historyCap)
            this.history.shift();

        this.inputReceivedCallbacks.forEach(callback => callback(message));
    }

    send(message) {
        this.outputSentCallbacks.forEach(callback => callback(message));
    }
    
    submit(message) {
        if (message !== null) {
            this.history.push(message);
            this.historyPtr = this.history.length;
            if (this.history.length > this.historyCap)
                this.history.shift();
            this.inputReceivedCallbacks.forEach(callback => callback(message));
        }

        let result = this.processor.process(message);
        this.outputSentCallbacks.forEach(callback => callback(result));
    }
}
