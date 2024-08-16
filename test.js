const Server = require("./Server");

const server = new Server();

server.get("/", (req, res) => {
    res.html("<center>hi</center>");
});

server.listen(6969, () => console.log("Listening <http://localhost:6969>"));







// TESTS
const Router = require("./Router");
if ([
    Router.createPathRegex("/hello/world").test("/hello/worldworld") === false,
    Router.createPathRegex("/hello/world").test("/hello/world/") === true,
    Router.createPathRegex("/hello/world").test("/hello/world/world") === true,
    Router.createPathRegex("/hello/world").test("/hello/world") === true,
    Router.createPathRegex("/hello/world/").test("/hello/world/world") === false,
    Router.createPathRegex("/hello/world/").test("/hello/world/") === true,
    Router.createPathRegex("/hello/world/*").test("/hello/world/hi/hi") === true,
    Router.createPathRegex("/hello/world/*/").test("/hello/world/hi/hi") === false,
    Router.createPathRegex("/hello/world/*/:a").test("/hello/world/hi/hi") === true,
    Router.createPathRegex("/hello/world/*/:a").test("/hello/world/hi/hi/hi") === true,
    Router.createPathRegex("/hello/world/*/:a/").test("/hello/world/hi/hi/hi") === false,
    Router.createPathRegex("/hello/world/*/:{a}/").test("/hello/world/hi/hi/") === true,
    Router.createPathRegex("/hello/world/*/:{}/").test("/hello/world/hi/hi/") === false,
    Router.createPathRegex("/hello/world/*/:{}/").test("/hello/world/hi/:{}/") === true,
    Router.createPathRegex("/hello/world/\\*/").test("/hello/world/*") === true,
    Router.createPathRegex("/hello/world/\\:test/").test("/hello/world/:test") === true,
    Router.createPathRegex("/hello/world/\\:{test}/").test("/hello/world/:{test}") === true,
].includes(false)) console.log("FAILED TESTS")