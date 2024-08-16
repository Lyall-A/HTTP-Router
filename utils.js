function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function objectDefaults(obj, def) {
    if (typeof obj !== "object") return def;
    
    return (function checkEntries(object = obj, defaultObj = def) {
        Object.entries(defaultObj).forEach(([key, value]) => {
            if (object[key] === undefined) object[key] = value;
            else if (value !== null && typeof value === "object" && typeof object[key] === "object") checkEntries(object[key], value);
        });
        return object;
    })();
}

module.exports = {
    escapeRegex,
    objectDefaults
};