const clicksPath = '/mp3/keyclicks/';
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
/**
 * Play a click sound.
 * @param index Index of sound to play. If none, pick randomly.
 * @returns Duration of sound in seconds.
 */
export function playClick(index?: number): number {
    if (!index) {
        index = Math.floor(Math.random() * clicks.length);
    }
    clicks[index].play();
    return clicks[index].duration;
}

const beepsPath = '/mp3/beeps/';
const beepsFilenames = ['1.wav', '2.wav', '3.wav', '4.wav', '5.wav', '6.wav', '7.wav'];
const beeps = beepsFilenames.map((name) => new Audio(`${beepsPath}${name}`));

/**
 * Play a beep sound.
 * @param index Index of sound to play. If none, pick randomly.
 * @returns Duration of sound in seconds.
 */
export function playBeep(index?: number): number {
    if (!index) {
        index = Math.floor(Math.random() * beeps.length);
    }
    beeps[index].play();
    return beeps[index].duration;
}
