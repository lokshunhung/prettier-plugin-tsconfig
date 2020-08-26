import type {ObjectExpression, ObjectProperty, StringLiteral} from "@babel/types";
import {cloneDeepWithoutLoc, isObjectExpression, isObjectProperty, isStringLiteral} from "@babel/types";
import type {AST} from "prettier";
import {sortedKeyIndex} from "./sorted-key-index";

type ObjectExpressionProperty = ObjectExpression["properties"][number];

// prettier-ignore
const sortObjectProperties = (a: ObjectProperty, b: ObjectProperty): number =>
    sortedKeyIndex[(a.key as StringLiteral).value] -
    sortedKeyIndex[(b.key as StringLiteral).value];

const visitObjectExpression = (node: ObjectExpression) => {
    const sortablePropertyGroups: ObjectExpressionProperty[][] = [];

    let currentPropertyGroup: ObjectExpressionProperty[] | undefined;

    for (const prop of node.properties) {
        if (isObjectProperty(prop) && isStringLiteral(prop.key)) {
            if (!currentPropertyGroup) {
                currentPropertyGroup = [];
                sortablePropertyGroups.push(currentPropertyGroup);
            }
            if (isObjectExpression(prop.value) && prop.key.value === "compilerOptions") {
                visitObjectExpression(prop.value);
            }
            currentPropertyGroup.push(prop);
        } else {
            currentPropertyGroup = [];
            sortablePropertyGroups.push(currentPropertyGroup);
            currentPropertyGroup.push(prop);
            currentPropertyGroup = undefined;
        }
    }

    const newProperties: ObjectExpressionProperty[] = [];

    for (const group of sortablePropertyGroups) {
        group.length > 1 && (group as ObjectProperty[]).sort(sortObjectProperties);
        newProperties.push(...group);
    }

    node.properties = newProperties;
    // prettier might reads the properties `start`, `end`, `loc` if they are present
    // remove them to force prettier to calculate the correct positions
    node.start = null;
    node.end = null;
    node.loc = null;
};

export const transformAST = (ast: AST): AST => {
    if (isObjectExpression(ast)) {
        visitObjectExpression(ast);
        return cloneDeepWithoutLoc(ast);
    }
    return ast;
};
