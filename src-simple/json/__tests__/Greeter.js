import { jest } from '@jest/globals';
import { default as Greeter } from '../Greeter.js';
import { Processor } from '../../js/terminal/Processor.js';
import { default as Terminal } from '../../js/terminal/Terminal.js';

jest.mock('../../js/terminal/Terminal.js');

let mockTerminal;
let processor;

beforeEach(() => {
    mockTerminal = new Terminal();
    processor = new Processor(mockTerminal, Greeter);
});