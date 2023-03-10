const caretOn = '\u2593';
const caretOff = ' ';

const consoleInput = document.getElementById("consoleInput");

consoleInput.addEventListener('focusin', onInputFocusIn);
consoleInput.addEventListener('focusout', onInputFocusOut);

let blinkIntervalHandler;
let blinkIntervalOn = true;
function blinkFunc() {
    if (blinkIntervalOn) {
        consoleInput.value
    }
}

let caretPosition;
function onInputFocusIn(event) {
    consoleInput.value += caretOn;
    caretPosition = consoleInput.value.length-1;
}

function onInputFocusOut(event) {
    consoleInput.value = consoleInput.value.replace(caretOn, '');
}

function onInputLeft() {
    
    caretPosition--;
}