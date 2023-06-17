import { init as initSettings, Settings } from './Settings.js';
import TerminalView from './terminal/TerminalView.js';
import './SoundPlayer.js';

const terminal = new TerminalView(consoleInput, consoleLog);
consoleInput.focus();


// Settings binding and initialization
const consoleScreen = document.getElementById('console');
// Bind CRT flag -> CRT effect
Settings.crtEffect.addEventListener((opt) => Settings.crtEffect.value ? consoleScreen.classList.add('crt') : consoleScreen.classList.remove('crt'));
// Bind CRT switch -> CRT flag
document.getElementById('crtSwitch').addEventListener('change', (e) => { Settings.crtEffect.value = e.target.checked});

initSettings();

// Align switch with current value
document.getElementById('crtSwitch').checked = Settings.crtEffect.value;

// Debug
window.terminal = terminal;
window.settings = Settings;