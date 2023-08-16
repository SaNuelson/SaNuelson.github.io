import { init as initSettings, Settings } from './Settings.js';
import TerminalView from './terminal/TerminalView.js';
import './SoundPlayer.js';

const termView = new TerminalView(consoleInput, consoleLog);
consoleInput.focus();

// Debug
window.terminalView = termView;
window.settings = Settings;

// Settings binding and initialization
const consoleScreen = document.getElementById('console');
consoleScreen.addEventListener('click', () => consoleInput.focus());

// Bind CRT flag -> CRT effect
Settings.crtEffect.addEventListener((opt) => Settings.crtEffect.value ? consoleScreen.classList.add('crt') : consoleScreen.classList.remove('crt'));
// Bind CRT switch -> CRT flag
document.getElementById('crtSwitch').addEventListener('change', (e) => Settings.crtEffect.value = e.target.checked);

// Bind ENABLE flag -> Console enable
Settings.enabled.addEventListener((opt) => termView.enabled = opt);
// Bind Console enable -> ENABLE flag
document.getElementById('mainSwitch').addEventListener('change', (e) => Settings.enabled.value = e.target.checked);

initSettings();

// Align switch with current value
document.getElementById('crtSwitch').checked = Settings.crtEffect.value;

// Run terminal
termView.terminal.submit(null);
