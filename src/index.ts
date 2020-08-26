import {AST, Parser, ParserOptions, Plugin} from "prettier";
import {parsers as parserBabel} from "prettier/parser-babel";
import {transformAST} from "./transform-ast";

const isTsconfig = (filepath: string) => /[\\/]tsconfig(\.\w+)?\.json$/i.test(filepath);

export const parsers: Plugin["parsers"] = {
    json: {
        ...parserBabel.json,

        parse(text: string, parsers: {[parserName: string]: Parser}, options: ParserOptions): AST {
            const ast = parserBabel.json.parse(text, parsers, options);

            const filepath = options.filepath;

            if (isTsconfig(filepath)) {
                return transformAST(ast);
            }

            return ast;
        },
    },
};
