const { validateLodashExists, setupDistDirectory, getFunctionFiles } = require("./file-utils");
const { generateFunctions } = require("./generator");
const { logger, colorize } = require("./logger");

function main() {
    const targetFunction = process.argv[2];
    
    logger.info("Starting UMD build generation...");
    
    validateLodashExists();
    setupDistDirectory(targetFunction);
    
    const functionFiles = getFunctionFiles(targetFunction);
    const count = colorize(functionFiles.length.toString(), 'bright');
    
    if (targetFunction) {
        logger.info(`Building UMD for function: ${colorize(targetFunction, 'cyan')}`);
    } else {
        logger.info(`Building UMD for ${count} lodash functions`);
    }
    
    generateFunctions(functionFiles);
    
    const message = targetFunction 
        ? `Generated UMD build for function ${colorize(targetFunction, 'cyan')} in ${colorize('dist/', 'yellow')}`
        : `All ${count} lodash UMD entries generated in ${colorize('dist/', 'yellow')}`;
    
    logger.success(message);
}

main();
