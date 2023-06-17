export default {
    handlers: [
        {
            context: "name input",
            
        }
    ],
    commands: [
        {
            name: "hello",
            response: () => "Hello there!",
        },
        {
            name: "hi",
            response: (m) => {
                m.setState("ctx", "name input");
                return "Hi there, what's your name?";
            }
        },
        {
            name: "now",
            response: () => new Date(Date.now()).toISOString(),
            attributes: {
                tooltip: "Show the current date & time"
            }
        },
        {
            name: "about",
            response: (m) => {
                m.setState("ctx", "about");
            }
        }
    ]
};