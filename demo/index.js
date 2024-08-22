const port = 8080;
const Server = require("../Server");

server = new Server({
    routerOptions: [
        { ignoreRoot: ["/api"] }, // TODO: automate this pls lol
        { root: "/api" }
    ]
});

[appRouter, apiRouter] = server.routers;

require("./app");
require("./api");

server.listen(port, () => console.log(`Listening at :${port}`));