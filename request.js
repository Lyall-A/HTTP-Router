function parse(raw) {

}

function apply(raw, x) {
    x._raw = raw;
    x._parsed = parse(raw);


}

module.exports = {
    parse,
    apply
}