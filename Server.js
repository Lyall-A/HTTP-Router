const http = require("http");
const https = require("https");

const { objectDefaults } = require("./utils");
const request = require("./request");
const response = require("./response");
const Router = require("./Router");

class Server {
    constructor(options) {
        this._options = objectDefaults(options, {
            router: null,
            server: null
        });

        this.router = this._options.router || new Router();
        this.server = this._options.server || ((this._options.tls && this._options.key && this._options.cert) ? https : http).createServer({ key: this._options.key, cert: this._options.cert, ...this._options.serverOptions });

        // Setup router
        this.server.on("request", this.router.route);
        
        // Apply custom req and res
        this.router.any("*", (req, res, next) => {
            request.apply(req, req);
            response.apply(res, res);
            next();
        });
    }

    // Router
    any = (...args) => this.router.any(...args);
    get = (...args) => this.router.get(...args);
    head = (...args) => this.router.head(...args);
    post = (...args) => this.router.post(...args);
    put = (...args) => this.router.put(...args);
    delete = (...args) => this.router.delete(...args);
    connect = (...args) => this.router.connect(...args);
    options = (...args) => this.router.options(...args);
    trace = (...args) => this.router.trace(...args);
    patch = (...args) => this.router.patch(...args);

    // Listen
    listen = (...args) => this.server.listen(...args);
}

module.exports = Server;