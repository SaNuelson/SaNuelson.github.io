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
            response: async (app) => {
                await app.out("Hello, I'm the greeter.");
                await app.out('How are you doing today?');
                await app.out('Are you sure you want to talk?');
                await app.out('I think you should talk now.');
                return true;
            },
        },
        {
            name: 'repeat',
            response: async (app) => {
                await app.out('Ok, I will repeat what you said.');
                let input = await app.in();
                await app.out(input);
                return true;
            },
        },
        {
            name: 'hello',
            description: 'Nothing but a simple greeting.',
            response: async (app, name: string) => {
                if (name.match(/^[Tt]ermie$/)) {
                    await app.out('Yay, you remember my name! What a pleasant suprise.');
                    await app.out('Hello to you too, dear' + app.get('name') + '!');
                    return true;
                }

                if (!app.has('name')) {
                    await app.out("Sorry, I still don't know your name. I believe acquaintance is in order.");
                    await app.out("My name's Termie. It's a pleasure to meet you.");
                    let name = await app.in("What's your name?");
                    if (name.length < 3) {
                        app.out('Well that just seems too short...');
                        return true;
                    }
                }

                app.out('Hello there, ' + app.get('name') + ' :)');
                return true;
            },
        },
    ],
};

export default Greeter;
