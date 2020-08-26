// @ts-check

/** @type {import("@babel/preset-env").Options} */
const presetEnvOptions = {
    bugfixes: true,
    loose: true,
    spec: false,
    modules: "commonjs",
    targets: {
        node: "10",
    },
};

// prettier-ignore
/** @type {import("@babel/core").TransformOptions} */
const config = {
    presets: [
        [require.resolve("@babel/preset-env"), presetEnvOptions],
        [require.resolve("@babel/preset-typescript"), {
            allowDeclareFields: true,
            onlyRemoveTypeImports: true,
        }],
    ],
};

module.exports = config;
