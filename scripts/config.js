const path = require("path");

const CONFIG = {
    LODASH_DIR: path.resolve(__dirname, "../node_modules/lodash"),
    DIST_DIR: path.resolve(__dirname, "../dist"),
    EXCLUDED_FILES: new Set(["fp.js", "function.js"])
};

module.exports = CONFIG;