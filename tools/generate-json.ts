import {existsSync, mkdirSync, statSync} from "fs";
import {join} from "path";
import {generateJSON} from "../vendor/scripts/generateJSON";

const outputDirectory = join(__dirname, "..", "tmp");

if (!(existsSync(outputDirectory) && statSync(outputDirectory).isDirectory())) {
    mkdirSync(outputDirectory);
}

generateJSON({
    tsconfigOptsOutputPath: join(outputDirectory, "tsconfigOpts.json"),
    tsconfigCategoriesOutputPath: join(outputDirectory, "tsconfigCategories.json"),
    tsconfigDefaultsOutputPath: join(outputDirectory, "tsconfigDefaults.json"),
    prettierOptions: {
        ...require(join(__dirname, "..", "package.json")).prettier,
        printWidth: 80,
    },
});
