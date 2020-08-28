import {describe, expect, test} from "@jest/globals";
import * as path from "path";
import * as prettier from "prettier";

describe("plugin", () => {
    const prettierFormatWithPlugin = (filepath: string, contents: string) => {
        return prettier.format(contents, {
            filepath,
            plugins: [path.join(__dirname, "..", "src", "index")],
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
        });
    };

    test("triggers on filenames that looks like tsconfig.json", () => {
        const tsconfig = `
        {
            "include": ["./src"],
            "compilerOptions": {
                "strict": true,
                "module": "CommonJS",
                "target": "es5",
                "outDir": "./dist/",
                "allowJs": true,
                "checkJs": true
            }
        }
        `;

        expect(prettierFormatWithPlugin("./package.json", tsconfig)).toMatchInlineSnapshot(`
            "{
              \\"include\\": [
                \\"./src\\"
              ],
              \\"compilerOptions\\": {
                \\"strict\\": true,
                \\"module\\": \\"CommonJS\\",
                \\"target\\": \\"es5\\",
                \\"outDir\\": \\"./dist/\\",
                \\"allowJs\\": true,
                \\"checkJs\\": true
              }
            }
            "
        `);

        expect(prettierFormatWithPlugin("./random.json", tsconfig)).toMatchInlineSnapshot(`
            "{
              \\"include\\": [\\"./src\\"],
              \\"compilerOptions\\": {
                \\"strict\\": true,
                \\"module\\": \\"CommonJS\\",
                \\"target\\": \\"es5\\",
                \\"outDir\\": \\"./dist/\\",
                \\"allowJs\\": true,
                \\"checkJs\\": true
              }
            }
            "
        `);

        expect(prettierFormatWithPlugin("./tsconfig.json", tsconfig)).toMatchInlineSnapshot(`
            "{
              \\"compilerOptions\\": {
                \\"allowJs\\": true,
                \\"checkJs\\": true,
                \\"module\\": \\"CommonJS\\",
                \\"outDir\\": \\"./dist/\\",
                \\"target\\": \\"es5\\",
                \\"strict\\": true
              },
              \\"include\\": [\\"./src\\"]
            }
            "
        `);

        expect(prettierFormatWithPlugin("./tsconfig.base.json", tsconfig)).toMatchInlineSnapshot(`
            "{
              \\"compilerOptions\\": {
                \\"allowJs\\": true,
                \\"checkJs\\": true,
                \\"module\\": \\"CommonJS\\",
                \\"outDir\\": \\"./dist/\\",
                \\"target\\": \\"es5\\",
                \\"strict\\": true
              },
              \\"include\\": [\\"./src\\"]
            }
            "
        `);
    });
});
