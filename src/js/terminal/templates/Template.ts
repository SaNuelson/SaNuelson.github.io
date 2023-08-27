import { Context } from '../Processor';

export type CommandResponse = (app: Context, ...args: any[]) => Promise<boolean>;

export type MemoryTemplate = { [key: string]: any };

export type CommandTemplate = {
    name: string | null;
    description?: string;
    default?: boolean;
    response: CommandResponse;
};

export type Template = {
    memory: MemoryTemplate;
    commands: Array<CommandTemplate>;
};
