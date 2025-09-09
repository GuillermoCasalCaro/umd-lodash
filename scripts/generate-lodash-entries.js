const fs = require("fs");
const path = require("path");

const lodashDir = path.resolve(__dirname, "../node_modules/lodash");
const srcDir = path.resolve(__dirname, "../src");

if (!fs.existsSync(lodashDir)) {
    console.error(
        'Lodash directory does not exist. Please run "npm install" first.'
    );
}

const clearSRC = () => {
    fs.readdirSync(srcDir).forEach((file) => {
        const filePath = path.join(srcDir, file);
        if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
        }
    });
};

if (fs.existsSync(srcDir)) {
    clearSRC();
} else {
    fs.mkdirSync(srcDir);
}

fs.readdirSync(lodashDir).forEach((file) => {
    const filePath = path.join(lodashDir, file);
    const stat = fs.statSync(filePath);
    const excludedFiles = new Set(["fp.js", "function.js"]);

    if (
        stat.isFile() &&
        file.endsWith(".js") &&
        !file.endsWith(".min.js") &&
        !file.startsWith("_") &&
        !excludedFiles.has(file)
    ) {
        const funcName = path.basename(file, ".js");
        const content = `import ${funcName} from "lodash/${funcName}";\nmodule.exports = ${funcName};\n`;
        const outputPath = path.join(srcDir, `${funcName}.js`);

        fs.writeFileSync(outputPath, content);
        console.log(`Generated ${outputPath}`);
    }
});

console.log("All lodash entries generated in src/");
