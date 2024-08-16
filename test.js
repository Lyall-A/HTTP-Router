const Server = require("./Server");

const server = new Server();

server.get("/", (req, res) => {
    res.html("<center>hi</center>");
})

server.listen(6969, () => console.log("Listening <http://localhost:6969>"));