const http = require("http");

const { escapeRegex, objectDefaults } = require("./utils");

class Router {
    constructor(options) {
        this._options = objectDefaults(options, {
            ignoreRepeatedSlashes: true
        });
        this._listeners = [];
    }

    route = async (req, res) => {
        const listeners = this._listeners.filter(i => i && (!i.method || i.method === req.method));
        const path = this.getPath(req.url);

        for (const listener of listeners) {
            const match = path.match(listener.regex);
            if (!match) continue;
            const params = Router.getParams(match, listener);
            let next = false;
            await listener.handler(req, res, () => next = true, params, listener);
            if (next) continue; else break;
        }
    }

    any = this.createMethod();
    get = this.createMethod("get");
    head = this.createMethod("head");
    post = this.createMethod("post");
    put = this.createMethod("put");
    delete = this.createMethod("delete");
    connect = this.createMethod("connect");
    options = this.createMethod("options");
    trace = this.createMethod("trace");
    patch = this.createMethod("patch");

    createMethod(method) {
        /**
         * Listens for requests
         * @param {string} path URL path
         * @param {(req: http.IncomingMessage, res: http.ServerResponse, next: () => void, params: object, listener: object) => void} handler Listener handler
         */
        return (path, handler) => {
            if (path === "*") path = /./; // Replace path with regex /./ if equals '*'

            const listenerIndex = this._listeners.push({
                path,
                handler,
                regex: path instanceof RegExp ? path : Router.createPathRegex(path),
                paramNames: Router.getParamNames(path),
                method: method?.toUpperCase()
            }) - 1;
    
            return () => this._listeners[listenerIndex] = null;
        }
    }

    getPath = (url) => {
        let path = url.split("?")[0];
        if (this._options.ignoreRepeatedSlashes) path = path.replace(/\/+/g, "/");
        // if (!path.endsWith("/")) path += "/";
        return path;
    }

    static pathRegex = /(?<!\\\\)((?<any>\\\*)|:{(?<enclosed_param>.+?)}|:(?!\\{[^}]\})(?<param>[^/]+))/g;

    static createPathRegex = (path) => {
        // NOTE: no trailing slash means that there can be paths after, eg. /hello will match /hello and /hello/WORLD/ANYTHING
    
        // /hello/world = /hello/world/ANY/THING
        // /hello/world/ = /hello/world
        // /hello/*/ = /hello/ANYTHING
        // /hello/hi-*/ = /hello/hi-ANYTHING
        // /hello/hi-*-hru/ = /hello/hi-ANYTHING-hru
        // /hello/:name/ = /hello/ANYTHING (with "name" parameter)
        // /hello/hi-:{name}-hru/ = /hello/hi-ANYTHING-hru (with "name" parameter)
        // /hello/hi-:name/ = /hello/hi-ANYTHING (with "name" parameter)
        
        return new RegExp(`^${escapeRegex(path).replace(this.pathRegex, "([^/]+)")}${path.endsWith("/") ? "?$" : "(?<end>$|\/.*)"}`.replace(/\\\\/g, ""));
    }

    static getParamNames = (path) => {
        if (typeof path !== "string") return { };
        return Array.from(escapeRegex(path).matchAll(this.pathRegex)).map(i => !i.groups.any ? i[4] : null);
    }

    static getParams = (match, listener) => {
        if (typeof listener.path !== "string") return { };
        const groups = match.slice(1);
        return Object.fromEntries(listener.paramNames.map((name, index) => name !== null ? [name, groups[index]] : null).filter(i => i !== null));
    }
}

module.exports = Router;