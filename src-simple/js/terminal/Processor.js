import { default as GreeterData } from "../../json/Greeter.js";
import { default as TestData } from "../../json/Test.js";
import EventDispatcher from "../base/EventDispatcher.js";

/**
 * @typedef {Object} ExprData
 * @property {string} type
 * @property {string} data 
 */

/**
 * @typedef {Object} CommandData
 * @property {string} name
 * @property {Array.<ExprData>} response 
 */

/**
 * @typedef {Object} ProcessorData
 * @property {Array.<CommandData>} commands 
 */

/** Class exlusively used as a wrapper for memory maintained by Processor and used by the commands. */
class Memory {
    /**
     * Any and all variables created and checked by the commands. 
     * @type {Object.<string, any>} 
     */
    #variables = {};
    variableChanged = new EventDispatcher();
    getVar(name) {
        if (this.#variables.hasOwnProperty(name))
        return this.#variables[name];
        return null;
    }
    setVar(name, value) {
        if (this.#variables[name] === value)
            return;
        let oldValue = this.#variables[name];
        this.#variables[name] = value;
        this.variableChanged.dispatchEvent(new CustomEvent('change', { detail: { name, value, oldValue } }));
    }
}

export class Processor {

    /** 
     * Parent terminal 
     * @type {import('./Terminal.js').default}
     */
    #terminal;

    log(msg) {
        this.#terminal.send(msg);
    }

    warn(msg) {
        this.#terminal.send('<span style="color:yellow">' + msg + '</span>');
    }

    err(msg) {
        this.#terminal.send('<span style="color:red">' + msg + '</span>');
    }
    
    input() {
        this.#terminal.
    }

    /**
     *  List of (both public and secret) known commands.
     *  @type {Object.<string, Command>} 
     */
    #commands = {};

    /**
     * Object holding memory, which is passed to all executed commands. 
     * @type {Memory} 
     */
    #memory = new Memory();

    /**
     * Get value for specified key, null if not present.
     * @param {string} key Key to look for in memory
     */
    get(key) {
        return this.#memory.getVar(key);
    }

    /**
     * Set value for specified key, overwriting any existing value.
     * @param {string} key Key to look for in memory
     * @param {any} value Value to set key to
     */
    set(key, value) {
        return this.#memory.setVar(key, value);
    }

    /**
     * Check if key is known within memory.
     * @param {string} key Key to look for in memory
     */
    has(key) {
        return this.#memory.getVar(key) !== null;
    }

    /** 
     * Create a new processor using a template.
     * @param {import('./Terminal.js').default} terminal
     * @param {ProcessorData} processorData 
     */
    constructor(terminal, processorData) {
        this.#terminal = terminal;

        if (processorData?.commands?.length > 0) 
        {
            for (const command of processorData.commands) {
                this.#commands[command.name] = new Command(command.name, command.response, command.description);
            }
        }

        // hack to bypass private field access
        let cmdsView = this.#commands;
        this.#commands["help"] = new Command(
            "help",
            function() {
                let knownCommands = Object.values(cmdsView).filter(cmd => cmd.description);
                if (knownCommands.length < 1) {
                    return "There are no known commands. Either none are implemented or they are too secret to show here.";
                }
                return knownCommands.map(cmd => "- " + cmd.toString()).join("\n");
            },
            undefined,
            {
                tooltip: "Show this help message",
            }
        );
    }

    /**
     * Process an incoming message and provide a response.
     * @param {string} message User input to be handled as a mesage.
     * @returns Response to the user query.
     */
    process(message) {
        if (this.#commands[message]) {
            return this.#commands[message].run(this, message);
        }
        return `Unknown command: '${message}'. Type 'help' for a list of commands.`;
    }
}

class Command {
    /**
     * 
     * @param {string} handle 
     * @param {Array.<ExprData>} response
     * @param {string} description 
     */
    constructor(handle, response, description) {
        this.handle = handle;
        this.response = response;
        this.description = description;
    }

    /**
     * @param {Memory} memory 
     * @param  {...any} args 
     * @returns {string}
     */
    run(memory, ...args) {
        return this.response(memory, ...args);
    }

    toString() {
        if (this.description)
        {
            return `${this.handle} - ${this.description}`;
        }
        else
        {
            return `${this.handle}`;
        }
    }
}

export const getGreeter = (terminal) => new Processor(terminal, TestData);