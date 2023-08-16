export default {
    memory: {
    },
    commands: [
        {
            name: null,
            default: true,
            condition: () => true,
            response: (app) => {
                app.log("Welcome to the terminal test. This is test state-machine speaking.")
            }
        },
        {
            name: "hello",
            description: "Nothing but a simple greeting.",
            response: (app, name) => {
                if (name.match(/^[Tt]ermie$/)) {
                    app.log("Yay, you remember my name! What a pleasant suprise.");
                    app.log("Hello to you too, dear" + app.get("name") + "!");
                    return;
                }
                
                if (!app.has("name")) {
                    app.warn("Sorry, I still don't know your name. I believe acquaintance is in order.");
                    app.log("My name's Termie. It's a pleasure to meet you.");
                    let name = app.input("What's your name?");
                    if (name.length < 3) {
                        app.warn("Well that just seems too short...");
                        return;
                    }
                }

                app.log("Hello there, " + app.get("name") + " :)");
            }

        }
    ]
}