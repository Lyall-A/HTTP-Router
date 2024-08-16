function parse(raw) {

}

function apply(raw, x) {
    x._raw = raw;
    x._parsed = parse(raw);

    x.json = (json, noContentType, noEnd) => {
        if (!noContentType) raw.setHeader("Content-Type", "application/json");
        raw[(!noEnd ? "end" : "write")](JSON.stringify(json));
    }

    x.html = (html, noContentType, noEnd) => {
        if (!noContentType) raw.setHeader("Content-Type", "text/html");
        raw[(!noEnd ? "end" : "write")](html);
    }
}

module.exports = {
    parse,
    apply
}