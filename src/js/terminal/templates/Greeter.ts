import { Context } from '../Processor';
import { Template } from './Template';

const Greeter: Template = {
    memory: {},
    commands: [
        {
            name: null,
            default: true,
            response: (app: Context): boolean => {
                app.out('Welcome to the terminal test. This is test state-machine speaking.');
                return true;
            },
        },
        {
            name: 'hello',
            description: 'Nothing but a simple greeting.',
            response: (app: Context, name: string): boolean => {
                if (name.match(/^[Tt]ermie$/)) {
                    app.out('Yay, you remember my name! What a pleasant suprise.');
                    app.out('Hello to you too, dear' + app.get('name') + '!');
                    return true;
                }

                if (!app.has('name')) {
                    app.out("Sorry, I still don't know your name. I believe acquaintance is in order.");
                    app.out("My name's Termie. It's a pleasure to meet you.");
                    let name = app.in("What's your name?");
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
