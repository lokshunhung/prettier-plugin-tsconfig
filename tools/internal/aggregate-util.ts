import {join} from "path";

export type Opts = typeof import("../../tmp/tsconfigOpts.json");

export type CategoryJson = typeof import("../../tmp/tsconfigCategories.json");
export type CategoryCode = number | (number & {__type__: "CategoryCode"});
export type CategoryKey = string | (string & {__type__: "CategoryKey"});

export type DefaultJson = typeof import("../../tmp/tsconfigDefaults.json");

const __JSON_CACHE__: Record<string, any> = {};

const tryRequire = (filename: string): any => {
    if (!(filename in __JSON_CACHE__)) {
        try {
            __JSON_CACHE__[filename] = require(join("..", "..", "tmp", filename));
        } catch (e) {
            throw new Error(`[category-util] ${filename} not found, try running \`$ yarn run generate-json\``);
        }
    }
    return __JSON_CACHE__[filename];
};

export const getOptsJson = (): Opts => {
    return tryRequire("tsconfigOpts.json");
};

export const getCategoryJson = (): CategoryJson => {
    return tryRequire("tsconfigCategories.json");
};

export const getDefaultJson = (): DefaultJson => {
    return tryRequire("tsconfigDefaults.json");
};

// https://github.com/microsoft/TypeScript-Website/blob/58683ff1bef022a85e79446844e53e250d03260a/packages/tsconfig-reference/scripts/generateMarkdown.ts
export const orderedCategories: ReadonlyArray<CategoryKey> = [
    "Project_Files_0",
    "Basic_Options_6172",
    "Strict_Type_Checking_Options_6173",
    "Module_Resolution_Options_6174",
    "Source_Map_Options_6175",
    "Additional_Checks_6176",
    "Experimental_Options_6177",
    "Advanced_Options_6178",
    "Command_line_Options_6171",
    "Watch_Options_999",
];

// https://github.com/microsoft/TypeScript-Website/tree/58683ff1bef022a85e79446844e53e250d03260a/packages/tsconfig-reference/copy/en/categories
const categoryDisplayNameMap: Readonly<Record<CategoryKey, string>> = {
    Additional_Checks_6176: "Linter Checks",
    Advanced_Options_6178: "Advanced",
    Basic_Options_6172: "Project Options",
    Command_line_Options_6171: "Command Line",
    Experimental_Options_6177: "Experimental",
    Module_Resolution_Options_6174: "Module Resolution",
    Project_Files_0: "File Inclusion",
    Source_Map_Options_6175: "Source Maps",
    Strict_Type_Checking_Options_6173: "Strict Checks",
    Watch_Options_999: "Watch Options",
};

export const findCategoryDisplayName = (category: CategoryCode | CategoryKey): string => {
    const categoryJson = getCategoryJson();
    for (const {code, key} of Object.values(categoryJson)) {
        if (category === code) {
            return categoryDisplayNameMap[key];
        }
        if (category === key) {
            return categoryDisplayNameMap[key];
        }
    }
    throw new Error(`[category-util] cannot find display name of category: "${category}"`);
};
