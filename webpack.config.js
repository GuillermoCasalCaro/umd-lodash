const path = require("path");
const fs = require("fs");

const srcDir = path.resolve(__dirname, "src");

const entries = fs.readdirSync(srcDir).filter((f) => f.endsWith(".js"));

const distDir = path.resolve(__dirname, "dist");
if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
}

module.exports = entries.map((file) => {
    const name = path.basename(file, ".js");
    console.log("Building " + name);
    return {
        mode: "production",
        entry: path.join(srcDir, file),
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: `${name}.umd.js`,
            library: {
                name: `umd_lodash_${name}`,
                type: "umd",
                umdNamedDefine: true,
            },
            // libraryExport: undefined,
            globalObject: "this",
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
});
