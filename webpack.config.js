const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.umd.js",
        library: "umdLodashAssign",
        libraryTarget: "umd",
        globalObject: "this",
        umdNamedDefine: true,
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
