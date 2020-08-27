import {writeFileSync} from "fs";
import {format, Options as PrettierOptions} from "prettier";
import {CategoryKey, findCategoryDisplayName, getOptsJson, orderedCategories} from "./aggregate-util";

const missingTsconfigTopLevelProperties: [string, number][] = [
    ["compilerOptions", -2],
    ["watchOptions", -1],
];

export interface AggregateJSONOptions {
    aggregateOutputPath: string;
    sortedKeyIndexOutputPath: string;
    prettierOptions: PrettierOptions;
}

export function aggregateJSON({aggregateOutputPath, sortedKeyIndexOutputPath, prettierOptions}: AggregateJSONOptions): void {
    type OptData = {
        categoryDisplayName: string;
        name: string;
        descriptionMessage: string;
        defaultValue: string | undefined;
    };

    const aggregateMap: Record<CategoryKey, OptData[]> = {};

    for (const opt of getOptsJson().options) {
        const categoryDisplayName = findCategoryDisplayName(opt.categoryCode);
        (aggregateMap[categoryDisplayName] ??= []).push({
            categoryDisplayName,
            name: opt.name,
            descriptionMessage: opt.description.message,
            defaultValue: opt.defaultValue,
        });
    }

    const sortedCategoryDisplayNames = orderedCategories.map(findCategoryDisplayName);

    const sortedAggregate = Object.fromEntries(
        Object.entries(aggregateMap)
            .sort(([a], [b]) => sortedCategoryDisplayNames.indexOf(a) - sortedCategoryDisplayNames.indexOf(b))
            .map(([k, v]) => {
                return [k, [...v].sort((a, b) => a.name.localeCompare(b.name))];
            })
    );

    const aggregateContents = format(JSON.stringify(sortedAggregate), {...prettierOptions, filepath: aggregateOutputPath});
    writeFileSync(aggregateOutputPath, aggregateContents, {encoding: "utf8"});

    const sortedKeys = Object.values(sortedAggregate)
        .flat()
        .map(opt => opt.name);
    const sortedKeyIndexContents = format(
        // prettier-ignore
        `// __auto-generated__\n\nexport const sortedKeyIndex: Readonly<Record<string, number>> = ${JSON.stringify(
            Object.fromEntries(
                missingTsconfigTopLevelProperties.concat(
                    Object.entries(sortedKeys).map(([index, key]) => [key, Number(index)])
                )
            )
        )};`,
        {...prettierOptions, filepath: sortedKeyIndexOutputPath}
    );
    writeFileSync(sortedKeyIndexOutputPath, sortedKeyIndexContents, {encoding: "utf8"});
}
