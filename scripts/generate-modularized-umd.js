const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const lodashDir = path.resolve(__dirname, "../node_modules/lodash");
const distDir = path.resolve(__dirname, "../dist");

if (!fs.existsSync(lodashDir)) {
    console.error(
        'Lodash directory does not exist. Please run "npm install" first.'
    );
    process.exit(1);
}

if (fs.existsSync(distDir)) {
    fs.readdirSync(distDir).forEach((file) => {
        const filePath = path.join(distDir, file);
        if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
        }
    });
} else {
    fs.mkdirSync(distDir);
}

const excludedFiles = new Set(["fp.js", "function.js"]);
let i = 0;

const functionFiles = fs.readdirSync(lodashDir).filter((file) => {
    const filePath = path.join(lodashDir, file);
    const stat = fs.statSync(filePath);

    return (
        stat.isFile() &&
        file.endsWith(".js") &&
        !file.endsWith(".min.js") &&
        !file.startsWith("_") &&
        !excludedFiles.has(file)
    );
});

functionFiles.forEach((file) => {
    i++;
    const filePath = path.join(lodashDir, file);
    const stat = fs.statSync(filePath);

    if (
        stat.isFile() &&
        file.endsWith(".js") &&
        !file.endsWith(".min.js") &&
        !file.startsWith("_") &&
        !excludedFiles.has(file)
    ) {
        const funcName = path.basename(file, ".js");
        const outputPath = path.join(distDir, `${funcName}.js`);
        const cmd = `npx lodash-cli include=${funcName} exports=umd --output "${outputPath}"`;
        try {
            execSync(cmd, { stdio: "inherit" });
            console.log(
                `[${i}/${functionFiles.length}] Generated ${outputPath}`
            );
        } catch (err) {
            console.error(
                `[${i}/${functionFiles.length}] Failed to generate ${outputPath}:`,
                err.message
            );
        }
    }
});

console.log("All lodash UMD entries generated in dist/");
