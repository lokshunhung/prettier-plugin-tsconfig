/* eslint-env commonjs, node */
// @ts-check

require("./babel-register");

const path = require("path");

if (process.argv.length !== 3) {
    console.error(`[tools] invalid usage: number of args must be 3, received ${process.argv.length}\n`);
    process.exit(1);
}

const fileArg = path.basename(process.argv[2]);

if (fileArg !== process.argv[2] || fileArg.includes(path.sep)) {
    console.error(`[tools] invalid usage: script arg should not reference any directory or contain path seperator: "${process.argv[2]}"\n`);
    process.exit(1);
}

if (path.extname(fileArg) !== "") {
    console.error(`[tools] invalid usage: script arg should not contain file extension: "${path.extname(fileArg)}"\n`);
    process.exit(1);
}

if (fileArg === "index") {
    console.error(`[tools] invalid usage: script arg cannot be "index"\n`);
    process.exit(1);
}

const scriptFile = path.join(__dirname, fileArg);
try {
    require(scriptFile);
} catch (e) {
    console.error(`[tools] fatal: cannot run script "${scriptFile}"\n`);
    console.error(`${e.message}\n`);
    process.exit(1);
}
