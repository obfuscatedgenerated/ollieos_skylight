function insert(el, options) {
    (options.target || document.querySelector("head")).appendChild(el);
}

module.exports = insert;
