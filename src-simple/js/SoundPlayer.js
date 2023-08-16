import { Random } from "./base/Random.js";

const clicks = [
    new Audio('./res/keyclicks/1.wav'),
    new Audio('./res/keyclicks/2.wav'),
    new Audio('./res/keyclicks/3.wav'),
    new Audio('./res/keyclicks/4.wav'),
    new Audio('./res/keyclicks/5.wav'),
    new Audio('./res/keyclicks/6.wav'),
    new Audio('./res/keyclicks/7.wav'),
    new Audio('./res/keyclicks/8.wav'),
    new Audio('./res/keyclicks/9.wav'),
    new Audio('./res/keyclicks/10.wav'),
    new Audio('./res/keyclicks/11.wav')
];

const beeps = [
    new Audio('./res/beeps/1.wav'),
    new Audio('./res/beeps/2.wav'),
    new Audio('./res/beeps/3.wav'),
    new Audio('./res/beeps/4.wav'),
    new Audio('./res/beeps/5.wav'),
    new Audio('./res/beeps/6.wav'),
    new Audio('./res/beeps/7.wav')
];

// Key clicks per key press
const consoleInput = document.getElementById("consoleInput");
consoleInput.onkeydown = function(e) {
    if (e.repeat || e.ctrlKey || e.altKey)
        return;
    clicks[Math.floor(Math.random() * clicks.length)].play();
}

// Console beeps while printing
const consoleOutput = document.getElementById("consoleLog");
const outputObserver = new MutationObserver(onOutputMutationObserved);
outputObserver.observe(consoleOutput, { childList: true, subtree: true, characterData: true });
const beepJitter = 100;
let lastBeepLoopFinishedAt;
function onOutputMutationObserved(mutations) {
    if (lastBeepLoopFinishedAt === undefined || Date.now() + Random.uniform(0, beepJitter) > lastBeepLoopFinishedAt) {
        let selectedBeep = beeps[Math.floor(Math.random() * beeps.length)];
        let playSuccess = selectedBeep.play();
        if (playSuccess !== undefined) {
            playSuccess.catch(e=>console.log(e));
        }
        lastBeepLoopFinishedAt = Date.now() + selectedBeep.duration * 1000;
        // console.log(`beep: last finished ${lastBeepLoopFinishedAt}, now ${Date.now()} + ${selectedBeep.duration * 1000}`);
    }
}