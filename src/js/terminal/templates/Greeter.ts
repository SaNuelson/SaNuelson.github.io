import { Template } from './Template';

const Greeter: Template = {
    memory: {},
    commands: [
        {
            name: null,
            default: true,
            response: async (app) => {
                await app.out("Welcome to the terminimal! If you're not sure how to continue, send help.");
                return true;
            },
        },
        {
            name: 'talk',
            description: 'Let the terminal ramble',
            response: async (app) => {
                await app.out("Hello, I'm the terminimal.");
                await app.out("I'm running using JS (though written in TS and later tranlated).");
                await app.out("Some day in the near future, I'll hopefully become a portfolio page.");
                await app.out("Undoubtedly though, I'll contain some games and easter eggs too tho.");
                await app.out("Yeah, that's probably everything about me. For now... ;)");
                return true;
            },
        },
        {
            name: 'repeat',
            response: async (app) => {
                let input = await app.in();
                console.log('repeat', input);
                await app.out('gotchu');
                await app.out(input);
                return true;
            },
        },
        {
            name: 'solve',
            description: 'Solve some math',
            response: async (app) => {
                await app.out('Ok, give me a math problem. Nothing hard tho.');
                let input = await app.in();

                let result;
                try {
                    result = eval(input);
                    await app.out(`That should be equal to ${result}`);
                } catch (err) {
                    await app.out("That doesn' seem like a proper math expression. :(");
                }
                return true;
            },
        },
        {
            name: 'hello',
            description: 'Nothing but a simple greeting.',
            response: async (app) => {
                if (app.has('name')) {
                    await app.out(`Hello, ${app.get('name')}, what\' up?`);
                    return true;
                }

                await app.out("Sorry, I still don't know your name. I believe acquaintance is in order.");
                await app.out("My name's Termie. It's a pleasure to meet you.");
                let name = await app.in("What's your name?");
                if (name.length < 3) {
                    await app.out("Well that just seems too short... I'm not calling you that. >:(");
                    return true;
                } else {
                    app.set('name', name);
                }

                await app.out('Hello there, ' + app.get('name') + ' :)');
                return true;
            },
        },
    ],
};

export default Greeter;
