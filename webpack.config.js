const path = require("path");
const fs = require("fs");

const srcDir = path.resolve(__dirname, "src");

const entries = {};
fs.readdirSync(srcDir).forEach((file) => {
    if (file.endsWith(".js")) {
        const name = path.basename(file, ".js");
        entries[name] = path.join(srcDir, file);
    }
});

module.exports = {
    mode: "production",
    entry: entries,
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].umd.js",
        library: "umdLodash[name]",
        libraryTarget: "umd",
        globalObject: "this",
        umdNamedDefine: true,
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js"],
    },
};
