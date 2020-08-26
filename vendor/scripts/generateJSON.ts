// https://github.com/microsoft/TypeScript-Website/blob/58683ff1bef022a85e79446844e53e250d03260a/packages/tsconfig-reference/scripts/generateJSON.ts
/* eslint-disable */
// @ts-nocheck

import ts from "typescript";

import {CommandLineOptionBase} from "./types";
import {writeFileSync} from "fs";
import {join} from "path";
import {format, Options as PrettierOptions} from "prettier";
import {denyList, relatedTo, deprecated, internal, defaultsForOptions, recommended, allowedValues, configToRelease, additionalOptionDescriptors} from "./tsconfigRules";
import {CompilerOptionName} from "../data/_types";

export interface CompilerOptionJSON extends CommandLineOptionBase {
    releaseVersion?: string;
    allowedValues?: string[];
    categoryCode?: number;
    related?: string[];
    deprecated?: string;
    internal?: true;
    recommended?: true;
    defaultValue?: string;
    hostObj: string;
}

export interface GenerateJSONOptions {
    tsconfigOptsOutputPath?: string;
    tsconfigCategoriesOutputPath?: string;
    tsconfigDefaultsOutputPath?: string;
    prettierOptions?: PrettierOptions;
}

export function generateJSON({
    tsconfigOptsOutputPath = join(__dirname, "..", "data", "tsconfigOpts.json"),
    tsconfigCategoriesOutputPath = join(__dirname, "..", "data", "tsconfigCategories.json"),
    tsconfigDefaultsOutputPath = join(__dirname, "..", "data", "tsconfigDefaults.json"),
    prettierOptions = {},
}: GenerateJSONOptions): void {
    const toJSONString = (obj: object) => format(JSON.stringify(obj), {...prettierOptions, filepath: "__.json"});
    const writeJSON = (filepath: string, obj: object) => writeFileSync(filepath, toJSONString(obj));

    // @ts-ignore because this is private
    const options = ts.optionDeclarations as CompilerOptionJSON[];
    const categories = new Set<ts.DiagnosticMessage>();

    // Cut down the list
    const filteredOptions = options.filter(o => !denyList.includes(o.name as CompilerOptionName)).filter(o => !o.isCommandLineOnly);

    // We don't get structured data for all compiler flags (especially ones which aren't in 'compilerOptions')
    // so, create these manually.

    const topLevelTSConfigOptions: CompilerOptionJSON[] = [
        {
            name: "files",
            type: "list",
            categoryCode: 0,
            // @ts-ignore
            description: {
                message: "Print names of files part of the compilation.",
            },
            defaultValue: "false",
            hostObj: "top_level",
        },
        {
            name: "include",
            type: "list",
            categoryCode: 0,
            // @ts-ignore
            description: {
                message: "Print names of files part of the compilation.",
            },
            defaultValue: "false",
            hostObj: "top_level",
        },
        {
            name: "exclude",
            type: "list",
            categoryCode: 0,
            // @ts-ignore
            description: {
                message: "Print names of files part of the compilation.",
            },
            defaultValue: "false",
            hostObj: "top_level",
        },
        {
            name: "extends",
            type: "string",
            categoryCode: 0,
            // @ts-ignore
            description: {
                message: "Print names of files part of the compilation.",
            },
            defaultValue: "false",
            hostObj: "top_level",
        },
        {
            name: "typeAcquisition",
            type: "string",
            categoryCode: 0,
            // @ts-ignore
            description: {
                message: "Print names of files part of the compilation.",
            },
            defaultValue: "false",
            hostObj: "top_level",
        },
        {
            name: "references",
            type: "string",
            categoryCode: 0,
            // @ts-ignore
            description: {
                message: "Print names of files part of the compilation.",
            },
            defaultValue: "false",
            hostObj: "top_level",
        },
    ];

    const watchOptions: CompilerOptionJSON[] = [
        {
            name: "watchFile",
            type: "string",
            categoryCode: 999,
            // @ts-ignore
            description: {
                message: "The strategy for how individual files are watched.",
            },
            defaultValue: "useFsEvents",
            hostObj: "watchOptions",
        },
        {
            name: "watchDirectory",
            type: "list",
            categoryCode: 999,
            // @ts-ignore
            description: {
                message: "The strategy for how entire directory trees are watched under systems that lack recursive file-watching functionality.",
            },
            defaultValue: "useFsEvents",
            hostObj: "watchOptions",
        },
        {
            name: "fallbackPolling",
            type: "list",
            categoryCode: 999,
            // @ts-ignore
            description: {
                message: "The polling strategy that gets used when the system runs out of native file watchers.",
            },
            hostObj: "watchOptions",
        },
    ];

    const allOptions = [...topLevelTSConfigOptions, ...filteredOptions, ...watchOptions].sort((l, r) => l.name.localeCompare(r.name));

    allOptions.forEach(option => {
        const name = option.name as CompilerOptionName;

        // Convert JS Map types to a JSONable obj
        if ("type" in option && typeof option.type === "object" && "get" in option.type) {
            // Option definitely has a map obj, need to resolve it
            const newOptions = {};
            option.type.forEach((v, k) => (newOptions[k] = v));
            // @ts-ignore
            option.type = newOptions;
        }

        // Convert categories to be something which can be looked up
        if ("category" in option) {
            categories.add(option.category);
            option.categoryCode = option.category.code;
            option.category = undefined;
        } else if (option.name in additionalOptionDescriptors) {
            // Set category code manually because some options have no category
            option.categoryCode = additionalOptionDescriptors[option.name].categoryCode;
        }

        // If it's got related fields, set them
        const relatedMetadata = relatedTo.find(a => a[0] == name);
        if (relatedMetadata) {
            option.related = relatedMetadata[1];
        }

        if (deprecated.includes(name)) {
            option.deprecated = "Deprecated";
        }

        if (internal.includes(name)) {
            option.internal = true;
        }

        if (recommended.includes(name)) {
            option.recommended = true;
        }

        if (name in allowedValues) {
            option.allowedValues = allowedValues[name];
        }

        if (name in configToRelease) {
            option.releaseVersion = configToRelease[name];
        }

        if (name in defaultsForOptions) {
            option.defaultValue = defaultsForOptions[name];
        }

        option.hostObj = "compilerOptions";

        // Remove irrelevant properties
        delete option.shortName;
        delete option.showInSimplifiedHelpView;
    });

    writeJSON(tsconfigOptsOutputPath, {
        options: allOptions,
    });

    // Improve the typing for the rules
    const dataTypesOutputPath = join(__dirname, "..", "data", "_types.ts");
    writeFileSync(
        dataTypesOutputPath,
        format(`// __auto-generated__ \n\n export type CompilerOptionName = '${options.map(o => o.name).join("' | '")}'`, {...prettierOptions, filepath: dataTypesOutputPath})
    );

    const categoryMap = {};
    categories.forEach(c => (categoryMap[c.code] = c));

    // Add custom categories, for custom compiler flags
    categoryMap["0"] = {
        code: 0,
        category: 3,
        key: "Project_Files_0",
        message: "Project File Management",
    };

    categoryMap["999"] = {
        code: 999,
        category: 4,
        key: "Watch_Options_999",
        message: "Watch Options",
    };

    writeJSON(tsconfigCategoriesOutputPath, categoryMap);

    // @ts-ignore - Print the defaults for a TS Config file
    const defaults = ts.defaultInitCompilerOptions;
    writeJSON(tsconfigDefaultsOutputPath, defaults);
}
