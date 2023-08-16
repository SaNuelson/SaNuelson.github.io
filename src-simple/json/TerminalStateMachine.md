TerminalStateMachine
===

### Architecture
Necessary capabilities of terminal state machine:
- read input
    - doesn't need raw input, can be pre-parsed to args vector
    - called with args `(app, arg1, arg2, arg3)`
    - e.g. terminal cmd `hello john` executes `hello` context as `machine.hello.response(app, 'john')`
- request input without yielding control
    - meaning control needs to be held in terminal, not page itself
    - `app.input()`
- request new machines / terminating self
    - `app.push(nextMachineId)`
    - `app.pop()`
- accessing and managing memory
    - memory needs to be separate, or pop would wipe it whole
    - memory needs to be accessible from callees, since args
    - memory is stacked similarly to machines, in form of JS object prorotypes, i.e.:
        - machine writes only to local memory
        - machine seeks memories starting from local up to global. First find for requested key is returned
            - optionally, keys can be prefixed `#` similar to private props in JS to avoid/block recursive search.
    - `app.setMemory(key, value)`
    - `app.getMemory(key)`
```js
export default {
    /* 
        Memory is loaded when inserting machine on stack.
    */
    memory: {
        someKey: someValue
    },
    /*
        List of possible handlers of communication from user/terminalview.
        Each is defined by its handle, optionally supplied by peekable description,
        and containing a response function that appropriately handles incoming query,
        and changes the environment appropriately.
    */
    commands: [
        {
            name: null
            /*
            - case-insensitive handle, used as key when searching unprompted user input
            - spaces not allowed, replaced with underscores if present
            */,
            default: false
            /*
            - whether used upon pushing machine on stack
            - exactly one must be default, otherwise undefined behavior
            - command is still callable by name, leave name as null to disable
            */,
            response: () => {}
            /*
            - function ran when command is matched
            */
        }
    ]
}
```