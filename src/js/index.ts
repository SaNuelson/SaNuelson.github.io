import { init as initSettings, Settings } from './Settings.js';
import TerminalView from './terminal/TerminalView.js';
import './SoundPlayer.js';

const consoleInput = document.getElementById('consoleInput') as HTMLInputElement;
const consoleLog = document.getElementById('consoleLog') as HTMLInputElement;

const termView = new TerminalView(consoleInput, consoleLog);
consoleInput.focus();

// Debug
(window as any).terminalView = termView;
(window as any).settings = Settings;

// Settings binding and initialization
const consoleScreen = document.getElementById('console') as HTMLDivElement;
consoleScreen.addEventListener('click', () => consoleInput.focus());

/// *** CRT *** ///
Settings.crtEffect.addEventListener(() =>
    Settings.crtEffect.value ? consoleScreen.classList.add('crt') : consoleScreen.classList.remove('crt')
);
document
    .getElementById('crtSwitch')
    ?.addEventListener('change', (e) => (Settings.crtEffect.value = (e.target as HTMLInputElement).checked));

/// *** ENABLE *** ///
Settings.enabled.addEventListener(() => (termView.enabled = Settings.enabled.value));
Settings.enabled.addEventListener((e) => consoleScreen.classList.toggle('enabled', Settings.enabled.value));
document
    .getElementById('mainSwitch')
    ?.addEventListener('change', (e) => (Settings.enabled.value = (e.target as HTMLInputElement).checked));

initSettings();

// Align switch with current value
(document.getElementById('crtSwitch') as HTMLInputElement).checked = Settings.crtEffect.value;

termView.terminal.start();
