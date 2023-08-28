import { Processor, ITerminal } from '../Processor';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { Template } from '../templates/Template';
import { Mocked } from 'jest-mock';

let inputStream: string[] = [];
let outputStream: string[] = [];
let terminal: Mocked<ITerminal>;

beforeEach(() => {
    outputStream = [];
    inputStream = [];
    terminal = {
        write: jest.fn((msg: string): Promise<void> => {
            outputStream.push(msg);
            return Promise.resolve();
        }),
        read: jest.fn((): Promise<string> => new Promise((r) => r(inputStream.shift() ?? ''))),
    };
});

describe('Processor', () => {
    it('should be constructible', () => {
        const processor = new Processor(terminal, {} as Template);
        expect(processor).toBeInstanceOf(Processor);
    });

    it('should run init command upon starting', () => {
        let template: Template = {
            memory: {},
            commands: [
                {
                    name: null,
                    response: async (ctx) => {
                        ctx.out('non-default');
                        return true;
                    },
                },
                {
                    name: null,
                    default: true,
                    response: async (ctx) => {
                        ctx.out('default');
                        return true;
                    },
                },
            ],
        };

        const processor = new Processor(terminal, template);

        processor.process();
        expect(terminal.write).toBeCalledTimes(1);
        expect(outputStream).toHaveLength(1);
        expect(outputStream[0]).toEqual('default');
    });

    it('should propagate output calls', async () => {
        let template: Template = {
            memory: {},
            commands: [
                {
                    name: 'out',
                    response: async (ctx) => {
                        ctx.out('test');
                        return true;
                    },
                },
            ],
        };

        const processor = new Processor(terminal, template);

        await processor.process('out');
        expect(terminal.write).toBeCalledTimes(1);
        expect(outputStream).toHaveLength(1);
        expect(outputStream[0]).toEqual('test');
    });

    it('should propagate input calls', async () => {
        inputStream.push('a');
        inputStream.push('b');
        let template: Template = {
            memory: {},
            commands: [
                {
                    name: 'in',
                    response: async (ctx) => {
                        let input = await ctx.in();
                        await ctx.out(input);
                        return true;
                    },
                },
            ],
        };

        const processor = new Processor(terminal, template);

        await processor.process('in');
        await processor.process('in');

        expect(terminal.read).toBeCalledTimes(2);
        expect(terminal.write).toBeCalledTimes(2);

        expect(outputStream).toHaveLength(2);
        expect(outputStream[0]).toEqual('a');
        expect(outputStream[1]).toEqual('b');
    });

    it('should pass arguments', async () => {
        let template: Template = {
            memory: {},
            commands: [
                {
                    name: 'arg',
                    response: async (ctx, arg) => {
                        ctx.out(arg);
                        return true;
                    },
                },
            ],
        };

        const processor = new Processor(terminal, template);

        processor.process('arg hello world');
        expect(terminal.write).toBeCalledTimes(1);
        expect(outputStream).toHaveLength(1);
        expect(outputStream[0]).toEqual('hello');
    });
});
