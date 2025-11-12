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

const targetFunction = process.argv[2];

if (!targetFunction) {
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
} else {
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }
}

const excludedFiles = new Set(["fp.js", "function.js"]);
let i = 0;

// Function to modify the UMD wrapper in generated files
function modifyUMDWrapper(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the build comment with relative path
    content = content.replace(
        /\* Build: `lodash include="([^"]+)" exports="umd" --output [^`]+`/g,
        '* Build: `lodash include="$1" exports="umd" --output .\\dist\\$1.js`'
    );
    
    // Check if this is a minified file
    const isMinified = filePath.endsWith('.min.js');
    
    if (isMinified) {
        // Handle minified UMD patterns
        // Pattern for: O._=e (where O is root variable and e is lodash variable)
        // Look for the pattern at the end: variable._=variable_name
        content = content.replace(
            /([A-Za-z_$][A-Za-z0-9_$]*)\._=([A-Za-z_$][A-Za-z0-9_$]*)\}\)\.call\(this\);$/,
            '$1._=Object.assign($1._||{},$2)}).call(this);'
        );
        
        // Also handle the AMD/CommonJS parts in minified code
        // Pattern: (F.exports=e)._=e becomes (F.exports=Object.assign(F.exports||{},e))._=F.exports
        content = content.replace(
            /\(([A-Za-z_$][A-Za-z0-9_$]*)\.exports=([A-Za-z_$][A-Za-z0-9_$]*)\)\._=\2/g,
            '($1.exports=Object.assign($1.exports||{},$2))._=$1.exports'
        );
        
        // Pattern: x._=e becomes x._=F.exports (where x is freeExports and F is freeModule)
        content = content.replace(
            /([A-Za-z_$][A-Za-z0-9_$]*)\._=([A-Za-z_$][A-Za-z0-9_$]*):([A-Za-z_$][A-Za-z0-9_$]*)\._=\2/g,
            '$1._=$3.exports:$3._=$3.exports'
        );
        
        // Handle the AMD define case: O._=e, define(function(){return e})
        content = content.replace(
            /([A-Za-z_$][A-Za-z0-9_$]*)\._=([A-Za-z_$][A-Za-z0-9_$]*), define\(function\(\)\{return \2\}\)/g,
            '$1._=Object.assign($1._||{},$2), define(function(){return $2})'
        );
        
    } else {
        // Handle non-minified UMD wrapper patterns
        content = content.replace(
            /root\.\_ = lodash;/g,
            'root._ = Object.assign(root._ || {}, lodash);'
        );
        
        content = content.replace(
            /\(freeModule\.exports = lodash\)\.\_ = lodash;/g,
            '(freeModule.exports = Object.assign(freeModule.exports || {}, lodash))._ = freeModule.exports;'
        );
        
        content = content.replace(
            /freeExports\.\_ = lodash;/g,
            'freeExports._ = freeModule.exports;'
        );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

const functionFiles = fs.readdirSync(lodashDir).filter((file) => {
    const filePath = path.join(lodashDir, file);
    const stat = fs.statSync(filePath);
    const funcName = path.basename(file, ".js");

    const isValidFile = (
        stat.isFile() &&
        file.endsWith(".js") &&
        !file.endsWith(".min.js") &&
        !file.startsWith("_") &&
        !excludedFiles.has(file)
    );

    if (targetFunction) {
        return isValidFile && funcName === targetFunction;
    }

    return isValidFile;
});

if (targetFunction && functionFiles.length === 0) {
    console.error(`Function '${targetFunction}' not found in lodash directory.`);
    process.exit(1);
}

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
        const exports = "umd";
        const cmd = `npx lodash-cli include=${funcName} exports=${exports} --output "${outputPath}"`;
        try {
            execSync(cmd, { stdio: "inherit" });
            
            // Post-process the generated file to modify UMD wrapper
            modifyUMDWrapper(outputPath);
            
            // Also process the minified version if it exists
            const minOutputPath = outputPath.replace('.js', '.min.js');
            if (fs.existsSync(minOutputPath)) {
                modifyUMDWrapper(minOutputPath);
            }
            
            console.log(
                `[${i}/${functionFiles.length}] Generated and modified ${outputPath}${fs.existsSync(minOutputPath) ? ' and ' + minOutputPath : ''}`
            );
        } catch (err) {
            console.error(
                `[${i}/${functionFiles.length}] Failed to generate ${outputPath}:`,
                err.message
            );
        }
    }
});

if (targetFunction) {
    console.log(`Generated UMD build for function '${targetFunction}' in dist/`);
} else {
    console.log("All lodash UMD entries generated in dist/");
}
