class Router {
    constructor() {
        this.listeners = [];
    }

    route = async (req, res) => {
        const listeners = this.listeners.filter(i => i && (!i.method || i.method === req.method));
        const path = getPath(req.url);

        for (const listener of listeners) {
            const match = path.match(listener.regex);
            if (!match) continue;
            const groups = match.slice(1);
            const params = Object.fromEntries(listener.paramNames.map((name, index) => name !== null ? [name, groups[index]] : null).filter(i => i !== null));
            let next = false;
            await listener.callback(req, res, () => next = true, params, listener);
            if (next) continue; else break;
        }
    }

    any = (path, callback) => { return this.createListener(path, callback) };
    get = (path, callback) => { return this.createListener(path, callback, "get") };
    head = (path, callback) => { return this.createListener(path, callback, "head") };
    post = (path, callback) => { return this.createListener(path, callback, "post") };
    put = (path, callback) => { return this.createListener(path, callback, "put") };
    delete = (path, callback) => { return this.createListener(path, callback, "delete") };
    connect = (path, callback) => { return this.createListener(path, callback, "connect") };
    options = (path, callback) => { return this.createListener(path, callback, "options") };
    trace = (path, callback) => { return this.createListener(path, callback, "trace") };
    patch = (path, callback) => { return this.createListener(path, callback, "patch") };

    createListener = (path, callback, method) => {
        const listenerIndex = this.listeners.push({
            path,
            callback,
            regex: path instanceof RegExp ? path : createPathRegex(path),
            paramNames: getParamNames(path),
            method: method?.toUpperCase()
        }) - 1;

        return () => this.listeners[listenerIndex] = null;
    }
}

const pathRegex = /(?<!\\\\)((?<any>\\\*)|:{(?<enclosed_param>.+?)}|:(?!\\{[^}]\})(?<param>[^/]+))/g;

function createPathRegex(path) {
    // NOTE: no trailing slash means that there can be paths after, eg. /hello will match /hello and /hello/WORLD/ANYTHING

    // /hello/world = /hello/world/ANY/THING
    // /hello/world/ = /hello/world
    // /hello/*/ = /hello/ANYTHING
    // /hello/hi-*/ = /hello/hi-ANYTHING
    // /hello/hi-*-hru/ = /hello/hi-ANYTHING-hru
    // /hello/:name/ = /hello/ANYTHING (with "name" parameter)
    // /hello/hi-:{name}-hru/ = /hello/hi-ANYTHING-hru (with "name" parameter)
    // /hello/hi-:name/ = /hello/hi-ANYTHING (with "name" parameter)

    return new RegExp(`^${escapeRegex(path).replace(pathRegex, "([^/]+)")}${path.endsWith("/") ? "?$" : "(?<end>$|\/.*)"}`.replace(/\\\\/g, ""));
}

function getParamNames(path) {
    return Array.from(escapeRegex(path).matchAll(pathRegex)).map(i => !i.groups.any ? i[4] : null);
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getPath(url) {
    let path = url.split("?")[0];
    // if (!path.endsWith("/")) path += "/";
    return path;
}

module.exports = Router;

// createPathRegex TESTS
createPathRegex("/:hi/:hi2/:hi3/*")
// console.log(createPathRegex("/hello/world").test("/hello/world") === true)
// console.log(createPathRegex("/hello/world").test("/hello/worldworld") === false)
// console.log(createPathRegex("/hello/world").test("/hello/world/") === true)
// console.log(createPathRegex("/hello/world").test("/hello/world/world") === true)
// console.log(createPathRegex("/hello/world/").test("/hello/world/world") === false)
// console.log(createPathRegex("/hello/world/").test("/hello/world/") === true)
// console.log(createPathRegex("/hello/world/*").test("/hello/world/hi/hi") === true)
// console.log(createPathRegex("/hello/world/*/").test("/hello/world/hi/hi") === false)
// console.log(createPathRegex("/hello/world/*/:a").test("/hello/world/hi/hi") === true)
// console.log(createPathRegex("/hello/world/*/:a").test("/hello/world/hi/hi/hi") === true)
// console.log(createPathRegex("/hello/world/*/:a/").test("/hello/world/hi/hi/hi") === false)
// console.log(createPathRegex("/hello/world/*/:{a}/").test("/hello/world/hi/hi/") === true)
// console.log(createPathRegex("/hello/world/*/:{}/").test("/hello/world/hi/hi/") === false)
// console.log(createPathRegex("/hello/world/*/:{}/").test("/hello/world/hi/:{}/") === true)
// console.log(createPathRegex("/hello/world/\\*/").test("/hello/world/*") === true)
// console.log(createPathRegex("/hello/world/\\:test/").test("/hello/world/:test") === true)
// console.log(createPathRegex("/hello/world/\\:{test}/").test("/hello/world/:{test}") === true)