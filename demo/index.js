const Server = require("../Server");
const Router = require("../Router");

server = new Server({ noRouter: true });

// App
// appRouter = server.router;
appRouter = new Router({ ignoreRoot: ["/api"] });
server.createRequestEvent(appRouter); // OR define server in Router options
server.createCustomRoute(appRouter);
require("./app");

// API
apiRouter = new Router({ root: "/api" });
server.createRequestEvent(apiRouter); // OR define server in Router options
server.createCustomRoute(apiRouter);
require("./api");

server.listen(8080, () => console.log(`Listening at :8080`));