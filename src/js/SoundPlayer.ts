import { Random } from './base/Random';

const clicksPath = '/public/mp3/keyclicks/';
const clicksFilenames = [
    '1.wav',
    '2.wav',
    '3.wav',
    '4.wav',
    '5.wav',
    '6.wav',
    '7.wav',
    '8.wav',
    '9.wav',
    '10.wav',
    '11.wav',
];
const clicks = clicksFilenames.map((name) => new Audio(`${clicksPath}${name}`));

// Key clicks per key press
const consoleInput = document.getElementById('consoleInput') as HTMLInputElement;
consoleInput.onkeydown = function (e) {
    if (e.repeat || e.ctrlKey || e.altKey) return;
    clicks[Math.floor(Math.random() * clicks.length)].play();
};

const beepsPath = '/public/mp3/beeps/';
const beepsFilenames = ['1.wav', '2.wav', '3.wav', '4.wav', '5.wav', '6.wav', '7.wav'];
const beeps = beepsFilenames.map((name) => new Audio(`${beepsPath}${name}`));

// Console beeps while printing
const consoleOutput = document.getElementById('consoleLog') as HTMLDivElement;
const outputObserver = new MutationObserver(onOutputMutationObserved);
outputObserver.observe(consoleOutput, { childList: true, subtree: true, characterData: true });
const beepJitter = 100;
let lastBeepLoopFinishedAt: number;
function onOutputMutationObserved() {
    if (lastBeepLoopFinishedAt === undefined || Date.now() + Random.uniform(0, beepJitter) > lastBeepLoopFinishedAt) {
        let selectedBeep = beeps[Math.floor(Math.random() * beeps.length)];
        let playSuccess = selectedBeep.play();
        if (playSuccess !== undefined) {
            playSuccess.catch((e) => console.log(e));
        }
        lastBeepLoopFinishedAt = Date.now() + selectedBeep.duration * 1000;
    }
}
