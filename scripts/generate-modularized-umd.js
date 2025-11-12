const { validateLodashExists, setupDistDirectory, getFunctionFiles } = require("./file-utils");
const { generateFunctions } = require("./generator");

function main() {
    const targetFunction = process.argv[2];
    
    validateLodashExists();
    setupDistDirectory(targetFunction);
    
    const functionFiles = getFunctionFiles(targetFunction);
    generateFunctions(functionFiles);
    
    const message = targetFunction 
        ? `Generated UMD build for function '${targetFunction}' in dist/`
        : "All lodash UMD entries generated in dist/";
    
    console.log(message);
}

main();
