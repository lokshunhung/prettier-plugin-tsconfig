/* eslint-env commonjs, node */
// @ts-check

/// <reference path="./internal/babel__register.d.ts" />

/** @type {any} */
const config = require("../.babelrc");

// prettier-ignore
require("@babel/register")({
    ...config,
    cwd: require("path").join(__dirname, ".."),
    extensions: [".ts", ".js"],
    cache: true,
});
