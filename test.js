const http = require("http");
const Router = require("./Router");

const server = http.createServer();
const router = new Router();

server.on("request", router.route);

router.any("/test/*", (req, res, next, params, listener) => {
    console.log("helllooo");
    next();
});

router.any("/test/:test", (req, res, next, params, listener) => {
    console.log(params.test);
    res.setHeader("Content-Type", "text/html").end("<!DOCTYPE html><center>hi</center>");
});

server.listen(6969, () => console.log("Listening"));