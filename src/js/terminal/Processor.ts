import EventDispatcher from '../base/EventDispatcher';
import { CommandResponse, Template } from './templates/Template';

/** Class exlusively used as a wrapper for memory maintained by Processor and used by the commands. */
class Memory {
    private variables: { [varName: string]: any } = {};

    variableChanged: EventDispatcher = new EventDispatcher();
    getVar(name: string): any {
        if (!this.variables.hasOwnProperty(name)) return null;
        return this.variables[name];
    }

    setVar(name: string, value: any): void {
        if (this.variables[name] === value) return;

        const oldValue = this.variables[name];
        this.variables[name] = value;
        this.variableChanged.dispatchEvent(new CustomEvent('change', { detail: { name, value, oldValue } }));
    }
}

/** Facaded processor passed to template commands. */
export class Context {
    constructor(processor: Processor, memory: Memory) {
        this.processor = processor;
        this.memory = memory;
    }

    private processor: Processor;

    async out(message: string): Promise<void> {
        await this.processor.out(message);
    }

    async in(message?: string): Promise<string> {
        return await this.processor.in(message);
    }

    private memory: Memory;

    get(key: string): any {
        return this.memory.getVar(key);
    }

    has(key: string) {
        return this.memory.getVar(key) !== null;
    }

    set(key: string, value: any): void {
        return this.memory.setVar(key, value);
    }
}

export interface ITerminal {
    write(text: string): Promise<void>;
    read(): Promise<string>;
}

export class Processor {
    private terminal: ITerminal;

    async out(message: string): Promise<void> {
        await this.terminal.write(message);
    }

    async in(message: string | undefined): Promise<string> {
        if (message !== undefined) {
            this.terminal.write(message);
        }
        return await this.terminal.read();
    }

    private commands: { [handle: string]: Command } = {};
    private default: Command | undefined;

    private memory: Memory = new Memory();

    private context: Context = new Context(this, this.memory);

    constructor(terminal: ITerminal, templateData: Template) {
        this.terminal = terminal;

        if (templateData?.commands?.length > 0) {
            for (const cmdTemplate of templateData.commands) {
                let command = new Command(cmdTemplate.name, cmdTemplate.response, cmdTemplate.description ?? null);
                this.commands[cmdTemplate.name ?? 'null'] = command;

                if (cmdTemplate.default) {
                    if (this.default !== undefined) {
                        throw new Error('At most one default command allowed');
                    }

                    this.default = command;
                }
            }
        }

        // hack to bypass private field access
        const cmdsView = this.commands;
        this.commands.help = new Command(
            'help',
            async (ctx: Context) => {
                const knownCommands = Object.values(cmdsView).filter((cmd) => cmd.handle);
                if (knownCommands.length < 1) {
                    ctx.out(
                        'There are no known commands. Either none are implemented or they are too secret to show here.'
                    );
                } else {
                    for (const cmd of knownCommands) {
                        await ctx.out(`- ${cmd.toString()}`);
                    }
                }
                return true;
            },
            'Show this help message'
        );
    }

    /** Process an incoming message and provide a response. */
    async process(message?: string): Promise<void> {
        if (!message) {
            if (this.default) {
                await this.default.run(this.context);
            }
            return;
        }

        const words = message.split(/\s+/g);
        const cmd = words[0] ?? '';
        const args = words.slice(1);
        if (this.commands[cmd ?? 'null']) {
            await this.commands[cmd ?? 'null'].run(this.context, ...args);
        } else {
            // TODO: Delegate to commands (i.e. for custom UNK CMD message)
            await this.out(`Unknown command: '${cmd}'. Type 'help' for a list of commands.`);
        }
    }
}

class Command {
    handle: string | null;
    response: CommandResponse;
    description: string | null;

    constructor(handle: string | null, response: CommandResponse, description: string | null) {
        this.handle = handle;
        this.response = response;
        this.description = description;
    }

    run(ctx: Context, ...args: any[]): Promise<boolean> {
        return this.response(ctx, ...args);
    }

    toString(): string {
        if (this.description) {
            return `${this.handle} - ${this.description}`;
        } else {
            return `${this.handle} - ???`;
        }
    }
}
