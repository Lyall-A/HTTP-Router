const http = require("http");
const Router = require("./Router");
const request = require("./request");
const response = require("./response");

const server = http.createServer();
const router = new Router();

server.on("request", router.route);

router.any("*", (req, res, next) => {
    // Apply custom req and res
    request.apply(req, req);
    response.apply(res, res);
    next();
});

router.get("/", (req, res) => {
    // res.json({ hello: "world" });
    res.html('<center style="font-size: 5em">hello world</center>');
});

server.listen(6969, () => console.log("Listening <http://localhost:6969>"));