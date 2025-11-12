const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const CONFIG = require("./config");
const { modifyUMDWrapper } = require("./umd-transformer");

function generateFunction(funcName, index, total) {
    const outputPath = path.join(CONFIG.DIST_DIR, `${funcName}.js`);
    const minOutputPath = outputPath.replace('.js', '.min.js');
    const command = `npx lodash-cli include=${funcName} exports=umd --output "${outputPath}"`;
    
    try {
        execSync(command, { stdio: "inherit" });
        
        modifyUMDWrapper(outputPath);
        
        if (fs.existsSync(minOutputPath)) {
            modifyUMDWrapper(minOutputPath);
        }
        
        const minSuffix = fs.existsSync(minOutputPath) ? ` and ${minOutputPath}` : '';
        console.log(`[${index}/${total}] Generated and modified ${outputPath}${minSuffix}`);
        
    } catch (error) {
        console.error(`[${index}/${total}] Failed to generate ${outputPath}:`, error.message);
    }
}

function generateFunctions(functionFiles) {
    functionFiles.forEach((file, index) => {
        const funcName = path.basename(file, ".js");
        generateFunction(funcName, index + 1, functionFiles.length);
    });
}

module.exports = {
    generateFunction,
    generateFunctions
};