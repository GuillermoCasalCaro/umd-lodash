const fs = require("fs");
const path = require("path");

const lodashDir = path.resolve(__dirname, "../node_modules/lodash");
const srcDir = path.resolve(__dirname, "../src");

if (!fs.existsSync(lodashDir)) {
    console.error(
        'Lodash directory does not exist. Please run "npm install" first.'
    );
}

if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
}

fs.readdirSync(lodashDir).forEach((file) => {
    const filePath = path.join(lodashDir, file);
    const stat = fs.statSync(filePath);

    if (
        stat.isFile() &&
        file.endsWith(".js") &&
        !file.startsWith("_") &&
        file !== "index.js"
    ) {
        const funcName = path.basename(file, ".js");
        const content = `import ${funcName} from 'lodash/${funcName}';\nexport default ${funcName};\n`;
        const outputPath = path.join(srcDir, `${funcName}.js`);

        fs.writeFileSync(outputPath, content);
        console.log(`Generated ${outputPath}`);
    }
});

console.log("All lodash entries generated in src/");
