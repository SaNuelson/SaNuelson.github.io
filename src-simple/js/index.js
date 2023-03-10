import Terminal from './Terminal.js';

const consoleInput = document.getElementById("consoleInput");
const consoleLog = document.getElementById("consoleLog");
const terminal = new Terminal();

consoleInput.addEventListener('keydown', onUserInput);
terminal.onInputReceived(onConsoleInput);
terminal.onOutputSent(onConsoleOutput);

consoleInput.focus();

function onUserInput(e) {
    switch(e.key) {
        case 'Enter':
            terminal.submit(e.target.value);
            consoleInput.value = '';
            break;
        case 'Up': case 'ArrowUp':
            e.preventDefault();
            consoleInput.value = terminal.prevHistory();
            break;
        case 'Down': case 'ArrowDown':
            e.preventDefault();
            consoleInput.value = terminal.nextHistory();
            break;
        }
}

function onConsoleInput(message) {
    let p = document.createElement('p');
    p.innerHTML = '&gt;' + message;
    consoleLog.appendChild(p);
}

function onConsoleOutput(message) {
    let p = document.createElement('p');
    printOut(p, message, 50, true);
    consoleLog.appendChild(p);
}

function printOut(element, text, delta, textAware=false) {
    let i = 0;
    let j = 0;
    let interval = setInterval(()=>{
        if (i < text.length) {
            if (textAware) {
                switch(text[i]) {
                    case ',':
                        if (j >= 2) break;
                        j++;
                        return;
                    case '.':
                        if (j >= 4) break;
                        j++;
                        return;
                }
            }
            element.innerHTML += text[i];
            j = 0;
            i++;
        }
        else {
            clearInterval(interval);
        }
    }, delta);
}
