import { init as initSettings, Settings } from './Settings.js';
import TerminalView from './terminal/TerminalView.js';
import { playBeep, playClick } from './SoundPlayer.js';

const consoleScreen = document.getElementById('console') as HTMLDivElement;
const consoleInput = document.getElementById('consoleInput') as HTMLInputElement;
const consoleLog = document.getElementById('consoleLog') as HTMLInputElement;

const termView = new TerminalView(consoleInput, consoleLog);

// Settings binding and initialization
consoleScreen.addEventListener('click', () => consoleInput.focus());
consoleInput.focus();

/// *** DEBUG *** ///
if (Settings.debug.value) {
    (window as any).terminalView = termView;
    (window as any).settings = Settings;
}

/// *** CRT *** ///
const crtSwitch = document.getElementById('crtSwitch');
if (crtSwitch) {
    Settings.crtEffect.addEventListener(() =>
        Settings.crtEffect.value ? consoleScreen.classList.add('crt') : consoleScreen.classList.remove('crt')
    );
    crtSwitch.addEventListener('change', (e) => (Settings.crtEffect.value = (e.target as HTMLInputElement).checked));
} else {
    console.error('CRT switch (input#crtSwitch) not found.');
}

/// *** ENABLE *** ///
const mainSwitch = document.getElementById('mainSwitch');
if (mainSwitch) {
    Settings.enabled.addEventListener(() => (termView.enabled = Settings.enabled.value));
    Settings.enabled.addOneShotListener(() => termView.terminal.start());
    Settings.enabled.addEventListener(() => consoleScreen.classList.toggle('enabled', Settings.enabled.value));
    mainSwitch.addEventListener('change', (e) => (Settings.enabled.value = (e.target as HTMLInputElement).checked));
} else {
    console.error('Main switch (input#mainSwitch) not found.');
}

/// *** SOUND *** ///
const soundSwitch = document.getElementById('soundSwitch');
const clicker = (e: Event) => {
    const kev = e as KeyboardEvent;
    if (kev.repeat || kev.ctrlKey || kev.altKey) return;
    playClick();
};
/** Time in seconds when last sound ends/will end. */
let lastSoundUntil: number = 0;
const beeper = () => {
    if (lastSoundUntil < Date.now()) {
        let waitSeconds = playBeep();
        lastSoundUntil = waitSeconds * 1000 + Date.now();
    }
};
function enableSound() {
    consoleInput.addEventListener('keydown', clicker);
    termView.addEventListener('printChar', beeper);
}
function disableSound() {
    consoleInput.removeEventListener('keydown', clicker);
    termView.removeEventListener('printChar', beeper);
}
if (soundSwitch) {
    Settings.sound.addEventListener(() => (Settings.sound.value ? enableSound() : disableSound()));
    soundSwitch.addEventListener('change', (e) => (Settings.sound.value = (e.target as HTMLInputElement).checked));
} else {
    console.error('Sound switch (input#soundSwitch) not found.');
}

initSettings();

// Align switch with current value
if (crtSwitch) {
    (crtSwitch as HTMLInputElement).checked = Settings.crtEffect.value;
}
if (soundSwitch) {
    (soundSwitch as HTMLInputElement).checked = Settings.sound.value;
    if (Settings.sound.value) enableSound();
}
