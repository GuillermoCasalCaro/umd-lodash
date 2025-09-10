# umd-lodash

UMD builds for modularized [Lodash](https://lodash.com/) functions.

This project provides each Lodash function as a standalone **UMD module**, making them easy to use in plain script tags, SystemJS, ES modules, or any environment without a bundler. You can also use this for externalization in bundlers (like Webpack) and load Lodash functions as UMD modules from a CDN, reducing your bundle size and allowing dynamic loading.

## 🚀 Externalization Example (Webpack) and direct link to CDN

You can configure your bundler (e.g., Webpack) to externalize Lodash functions and load them as UMD modules from a CDN:

```js
// webpack.config.js
const lodashFnsToExternalize = ["uniq", "flatten"];
const externals = Object.fromEntries(
    lodashFnsToExternalize.map((fn) => [
        `lodash/${fn}`,
        `https://cdn.jsdelivr.net/npm/umd-lodash@1.1.0/dist/${fn}.umd.js`,
    ])
);

module.exports = {
    // ...existing config...
    externals,
    // Configure externalsType/output.library.type as 'system'.
    // If you use the plugins of single-spa this may be implicit.
};
```

**Tip:** You can use an alias (e.g., `npm/umd-lodash@1.1.0/dist/${fn}.umd.js`) and resolve it to the CDN using a SystemJS import map in your `index.html`:

```html
<script type="systemjs-importmap">
    {
        "imports": {
            "npm/": "https://cdn.jsdelivr.net/npm/"
        }
    }
</script>
```

This allows you to reference modules using the `npm/` prefix, which SystemJS will resolve to the CDN automatically.

## 🌐 Usage via jsDelivr CDN

You can use any Lodash function by adding its script and using it globally as `umd_lodash_<functionName>`.

```html
<script src="https://cdn.jsdelivr.net/npm/umd-lodash@1.1.0/dist/chunk.umd.js"></script>
<script>
    const result = umd_lodash_chunk([1, 2, 3, 4, 5], 2);
    console.log(result); // [[1,2],[3,4],[5]]
</script>
```

## 🔧 Usage with SystemJS

```html
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js"></script>
<script>
    System.import(
        "https://cdn.jsdelivr.net/npm/umd-lodash@1.1.0/dist/camelCase.umd.js"
    ).then(({ default: camelCase }) => {
        console.log(camelCase("hello world")); // "helloWorld"
    });
</script>
```

## 📦 Usage with ES Modules (CDN)

You can also import Lodash functions as ES modules from the CDN:

```js
import debounce from "https://cdn.jsdelivr.net/npm/umd-lodash@1.0.6/dist/debounce.umd.js";

debounce(() => console.log("Debounced!"), 200);
```

## 📂 Available Functions

Every Lodash function (except internals like `_base*`) is exported as an individual UMD build under `dist/`.

Example paths:

-   `dist/assign.umd.js`
-   `dist/chunk.umd.js`
-   `dist/camelCase.umd.js`
-   `dist/uniq.umd.js`
-   `dist/flatten.umd.js`
-   `dist/debounce.umd.js`
-   ...

## 📜 License

This project is based on Lodash (MIT licensed).  
See [LICENSE](./LICENSE) for details.
