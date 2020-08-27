import {existsSync, mkdirSync, statSync} from "fs";
import {join} from "path";
import {aggregateJSON} from "./internal/aggregate-json";

const srcDirectory = join(__dirname, "..", "src");
const tmpDirectory = join(__dirname, "..", "tmp");

if (!(existsSync(tmpDirectory) && statSync(tmpDirectory).isDirectory())) {
    mkdirSync(tmpDirectory);
}

aggregateJSON({
    aggregateOutputPath: join(tmpDirectory, "aggregate.json"),
    sortedKeyIndexOutputPath: join(srcDirectory, "sorted-key-index.ts"),
    prettierOptions: {
        ...require(join(__dirname, "..", "package.json")).prettier,
        printWidth: 80,
    },
});
