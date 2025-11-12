const fs = require("fs");
const path = require("path");
const CONFIG = require("./config");
const { logger } = require("./logger");

function validateLodashExists() {
    if (!fs.existsSync(CONFIG.LODASH_DIR)) {
        logger.error('Lodash directory does not exist. Please run "npm install" first.');
        process.exit(1);
    }
}

function setupDistDirectory(targetFunction) {
    if (!targetFunction) {
        if (fs.existsSync(CONFIG.DIST_DIR)) {
            fs.readdirSync(CONFIG.DIST_DIR).forEach(file => {
                const filePath = path.join(CONFIG.DIST_DIR, file);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                }
            });
        } else {
            fs.mkdirSync(CONFIG.DIST_DIR);
        }
    } else if (!fs.existsSync(CONFIG.DIST_DIR)) {
        fs.mkdirSync(CONFIG.DIST_DIR);
    }
}

function isValidLodashFile(file) {
    const filePath = path.join(CONFIG.LODASH_DIR, file);
    const stat = fs.statSync(filePath);
    
    return stat.isFile() &&
           file.endsWith(".js") &&
           !file.endsWith(".min.js") &&
           !file.startsWith("_") &&
           !CONFIG.EXCLUDED_FILES.has(file);
}

function getFunctionFiles(targetFunction) {
    const allFiles = fs.readdirSync(CONFIG.LODASH_DIR).filter(isValidLodashFile);
    
    if (!targetFunction) {
        return allFiles;
    }
    
    const filteredFiles = allFiles.filter(file => {
        const funcName = path.basename(file, ".js");
        return funcName === targetFunction;
    });
    
    if (filteredFiles.length === 0) {
        logger.error(`Function '${targetFunction}' not found in lodash directory.`);
        process.exit(1);
    }
    
    return filteredFiles;
}

module.exports = {
    validateLodashExists,
    setupDistDirectory,
    isValidLodashFile,
    getFunctionFiles
};