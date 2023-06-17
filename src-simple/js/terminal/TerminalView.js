import EventDispatcher from '../base/EventDispatcher.js';
import Terminal from './Terminal.js';

/**
 * Creates a binding between a Terminal model and its interface.
 */
export default class TerminalView {
    constructor(input, output) {
        this.terminal = new Terminal();
        this.input = input;
        this.output = output;

        this.input.addEventListener('keydown', this.onInputKeyDown.bind(this));
        this.terminal.onInputReceived(this.onTerminalInput.bind(this));
        this.terminal.onOutputSent(this.onTerminalOutput.bind(this));

        this.currentPrint = null;
        this.printBegan = new EventDispatcher();
        this.printEnded = new EventDispatcher();
    }

    onInputKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                this.terminal.submit(e.target.value);
                this.input.value = '';
                break;
            case 'Up': case 'ArrowUp':
                e.preventDefault();
                this.input.value = this.terminal.prevHistory();
                break;
            case 'Down': case 'ArrowDown':
                e.preventDefault();
                this.input.value = this.terminal.nextHistory();
                break;
        }
    }

    onTerminalInput(message) {
        let p = document.createElement('p');
        p.innerHTML = '&gt;' + message;
        this.output.appendChild(p);
    }

    onTerminalOutput(message) {
        let p = document.createElement('p');
        this.printOut(p, message, 50, true);
        this.output.appendChild(p);
    }

    printOut(element, text, delta, textAware = false) {
        if (this.currentPrint !== null) {
            clearInterval(this.currentPrint.interval);
            this.currentPrint.target.innerHTML += this.currentPrint.content.slice(this.currentPrint.index);
            this.currentPrint = null;
        }
        let print = {
            target: element,
            content: text,
            index: 0,
            interval: null
        };
        this.currentPrint = print;

        // Fault check
        if (text === null || text === undefined) {
            console.trace("printOut text = " + text);
            text = "";
        }

        let delay = 0;
        let interval = setInterval(() => {
            if (print.index < text.length) {
                let char = text[print.index];

                // replace html-conflicting chars
                if (char === '<')
                    char = '&lt;';
                else if (char === '>')
                    char = '&gt;';
                else if (char === '&')
                    char = '&amp;';
                else if (char === '"')
                    char = '&quot;';
                else if (char === "'")
                    char = '&#39;';
                else if (char === '`')
                    char = '&#96;';
                else if (char === '\n')
                    char = '<br />';
                else if (char === '\r')
                    char = '<br />';
                else if (char === '\t')
                    char = '&nbsp;&nbsp;&nbsp;&nbsp;';
                else if (char === '\b')
                    char = '&nbsp;&nbsp;&nbsp;';
                else if (char === '\f')
                    char = '&nbsp;';
                else if (char === '\v')
                    char = '&nbsp;&nbsp;';
                else if (char === '\u00A0')
                    char = '&nbsp;';
                else if (char === '\u2028')
                    char = '&nbsp;';
                else if (char === '\u2029')
                    char = '&nbsp;';

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
                print.index++;
            }
            else {
                clearInterval(interval);
                this.currentPrint = null;
            }
        }, delta);
        print.interval = interval;
    }
}
