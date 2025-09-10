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
        `https://cdn.jsdelivr.net/npm/umd-lodash@1.1.0/dist/${fn}.min.js`,
    ])
);

module.exports = {
    // ...existing config...
    externals,
    // Configure externalsType/output.library.type as 'system'.
    // If you use the plugins of single-spa this may be implicit.
};
```

**Tip:** You can use an alias (e.g., `npm/umd-lodash@1.1.0/dist/${fn}.min.js`) and resolve it to the CDN using a SystemJS import map in your `index.html`:

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

You can use any Lodash function by adding its script. Each UMD build exposes the function as a property of the global `_` object (e.g., `_.noop`, `_.chunk`).

```html
<script src="https://cdn.jsdelivr.net/npm/umd-lodash@1.1.0/dist/chunk.min.js"></script>
<script>
    // _.chunk is now available globally
    console.log(_.chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
</script>
```

## 🔧 Usage with SystemJS

```html
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js"></script>
<script>
    System.import(
        "https://cdn.jsdelivr.net/npm/umd-lodash@1.1.0/dist/debounce.min.js"
    ).then(() => {
        // The global '_' object now has 'debounce'
        const debounced = _.debounce(() => console.log("Called!"), 200);
        debounced();
    });
</script>
```

## 📂 Available Functions

Every Lodash function (except internals like `_base*`) is exported as an individual UMD build under `dist/`.

### Non-Minified Builds

For every Lodash function, a non-minified build is also available at `dist/<function>.js` in addition to the minified version. Use the non-minified files for easier debugging or development.

Example paths:

-   `dist/assign.min.js` and `dist/assign.js`
-   `dist/chunk.min.js` and `dist/chunk.js`
-   `dist/camelCase.min.js` and `dist/camelCase.js`
-   `dist/uniq.min.js` and `dist/uniq.js`
-   `dist/flatten.min.js` and `dist/flatten.js`
-   `dist/debounce.min.js` and `dist/debounce.js`
-   `dist/noop.min.js` and `dist/noop.js`
-   ...

## 📜 License

This project is based on Lodash (MIT licensed).  
See [LICENSE](./LICENSE) for details.
