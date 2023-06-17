import { default as GreeterData } from "../../json/Greeter.js";
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

    #state = "start";
    stateChanged = new EventDispatcher();
    get state() { return this.#state; }
    set state(newState) {
        let hasStateChanged = this.#state !== newState;
        this.#state = newState;
        if (hasStateChanged) 
            this.stateChanged.dispatchEvent(new CustomEvent('change', { detail: { state: newState } }));
    }

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
     * Create a new processor using a template.
     * @param {ProcessorData} processorData 
     */
    constructor(processorData) {
        if (processorData?.commands?.length > 0) 
        {
            for (const command of processorData.commands) {
                this.#commands[command.name] = new Command(command.name, command.response, command.condition, command.attributes);
            }
        }

        // hack to bypass private field access
        let cmdsView = this.#commands;
        this.#commands["help"] = new Command(
            "help",
            function() {
                let knownCommands = Object.values(cmdsView).filter(cmd => !cmd.attributes?.secret);
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
            return this.#commands[message].run(this.#memory, message);
        }
        return `Unknown command: '${message}'. Type 'help' for a list of commands.`;
    }
}

class Command {
    /**
     * 
     * @param {string} handle 
     * @param {Array.<ExprData>} response 
     * @param {Array.<ExprData>} condition 
     * @param {Object.<string, any>} attributes 
     */
    constructor(handle, response, condition, attributes) {
        this.handle = handle;
        this.condition = condition;
        this.response = response;
        this.attributes = attributes;
    }

    /**
     * @param {Memory} memory 
     * @param  {...any} args 
     * @returns {string}
     */
    run(memory, ...args) {
        if (!this.condition || this.condition(memory, ...args)) {
            return this.response(memory, ...args);
        }
    }

    #runCondition(memory,...args) {
        
    }

    #runResponse(memory,...args) {

    }

    toString() {
        if (this.attributes && this.attributes.tooltip)
        {
            return `${this.handle} - ${this.attributes.tooltip}`;
        }
        else
        {
            return `${this.handle}`;
        }
    }
}

export const GreeterProcessor = new Processor(GreeterData);