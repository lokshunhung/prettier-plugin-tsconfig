# prettier-plugin-tsconfig

[![npm-badge][]][npm-link]
[![license-badge][]][license-link]

✨ An opinionated [prettier][prettier-link] plugin to format `tsconfig.json`.

**_NOTE: work in progress, please check the formatted `tsconfig.json` before committing changes_**

This plugin sorts keys in `tsconfig.json` according to the order of options appearing in the [tsconfig reference][tsconfig-reference-link].
Currently does **NOT** supports comments.

## Installation

1.  Install `prettier` and `prettier-plugin-tsconfig`.<br>

    ```sh
    $ yarn add --dev prettier prettier-plugin-tsconfig
    ```

<!-- prettier-ignore-start -->

2.  Add `prettier` as a runnable script.

    Example:

    ```json
    {
        "scripts": {
            "format": "prettier --write \"**/*.{js,json,ts}\""
        }
    }
    ```

<!-- prettier-ignore-end -->

3.  Run `prettier`.<br>

    ```sh
    $ yarn run format
    ```

[npm-badge]: https://img.shields.io/npm/v/prettier-plugin-tsconfig?style=flat
[npm-link]: https://www.npmjs.com/package/prettier-plugin-tsconfig
[license-badge]: https://img.shields.io/github/license/lokshunhung/prettier-plugin-tsconfig?style=flat
[license-link]: https://opensource.org/licenses/MIT
[prettier-link]: https://prettier.io
[tsconfig-reference-link]: https://www.typescriptlang.org/tsconfig
