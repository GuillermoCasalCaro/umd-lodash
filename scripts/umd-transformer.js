const fs = require("fs");

function fixBuildComment(content) {
    return content.replace(
        /\* Build: `lodash include="([^"]+)" exports="umd" --output [^`]+`/g,
        '* Build: `lodash include="$1" exports="umd" --output .\\dist\\$1.js`'
    );
}

function fixMinifiedUMD(content) {
    const patterns = [
        {
            search: /([A-Za-z_$][A-Za-z0-9_$]*)\._=([A-Za-z_$][A-Za-z0-9_$]*)\}\)\.call\(this\);$/,
            replace: '$1._=Object.assign($1._||{},$2)}).call(this);'
        },
        {
            search: /\(([A-Za-z_$][A-Za-z0-9_$]*)\.exports=([A-Za-z_$][A-Za-z0-9_$]*)\)\._=\2/g,
            replace: '($1.exports=Object.assign($1.exports||{},$2))._=$1.exports'
        },
        {
            search: /([A-Za-z_$][A-Za-z0-9_$]*)\._=([A-Za-z_$][A-Za-z0-9_$]*):([A-Za-z_$][A-Za-z0-9_$]*)\._=\2/g,
            replace: '$1._=$3.exports:$3._=$3.exports'
        },
        {
            search: /([A-Za-z_$][A-Za-z0-9_$]*)\._=([A-Za-z_$][A-Za-z0-9_$]*), define\(function\(\)\{return \2\}\)/g,
            replace: '$1._=Object.assign($1._||{},$2), define(function(){return $2})'
        }
    ];

    patterns.forEach(pattern => {
        content = content.replace(pattern.search, pattern.replace);
    });

    return content;
}

function fixRegularUMD(content) {
    const replacements = [
        [/root\.\_ = lodash;/g, 'root._ = Object.assign(root._ || {}, lodash);'],
        [/\(freeModule\.exports = lodash\)\.\_ = lodash;/g, '(freeModule.exports = Object.assign(freeModule.exports || {}, lodash))._ = freeModule.exports;'],
        [/freeExports\.\_ = lodash;/g, 'freeExports._ = freeModule.exports;']
    ];

    replacements.forEach(([search, replace]) => {
        content = content.replace(search, replace);
    });

    return content;
}

function modifyUMDWrapper(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = fixBuildComment(content);
    
    const isMinified = filePath.endsWith('.min.js');
    content = isMinified ? fixMinifiedUMD(content) : fixRegularUMD(content);
    
    fs.writeFileSync(filePath, content, 'utf8');
}

module.exports = {
    modifyUMDWrapper,
    fixBuildComment,
    fixMinifiedUMD,
    fixRegularUMD
};