function parse(raw) {
    const parsed = { };
    
    parsed.send = (data, contentType = "text/plain") => {
        if (contentType) raw.setHeader("Content-Type", contentType);
        raw.end(data);
        return parsed;
    }

    parsed.json = (json, noContentType, noEnd) => {
        if (!noContentType) raw.setHeader("Content-Type", "application/json");
        raw[(!noEnd ? "end" : "write")](JSON.stringify(json));
        return parsed;
    }

    parsed.html = (html, noContentType, noEnd) => {
        if (!noContentType) raw.setHeader("Content-Type", "text/html");
        raw[(!noEnd ? "end" : "write")](html);
        return parsed;
    }

    return parsed;
}

function apply(raw, x) {
    // x._raw = raw;
    x._parsed = parse(raw);

    Object.entries(x._parsed).forEach(([key, value]) => x[key] = value);
}

module.exports = {
    parse,
    apply
}