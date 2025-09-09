# umd-lodash

UMD builds for modularized [Lodash](https://lodash.com/) functions.  
This project provides each Lodash function as a standalone **UMD module**, making them easy to use in plain script tags, SystemJS, or any environment without a bundler.

## 🌐 Usage via jsDelivr CDN

Each function is available directly from jsDelivr.

**Example with `assign`:**

```html
<script src="https://cdn.jsdelivr.net/npm/umd-lodash@1.0.0/dist/assign.umd.js"></script>
<script>
    const result = lodashAssign({ a: 1 }, { b: 2 });
    console.log(result); // { a: 1, b: 2 }
</script>
```

**Example with `isEqual`:**

```html
<script src="https://cdn.jsdelivr.net/npm/umd-lodash@1.0.0/dist/isEqual.umd.js"></script>
<script>
    console.log(lodashIsEqual([1, 2], [1, 2])); // true
</script>
```

## 🔧 Usage with SystemJS

```html
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.15.1/dist/system.min.js"></script>
<script>
    System.import(
        "https://cdn.jsdelivr.net/npm/umd-lodash@1.0.0/dist/isEqual.umd.js"
    ).then(({ default: isEqual }) => {
        console.log(isEqual({ a: 1 }, { a: 1 })); // true
    });
</script>
```

## 📂 Available Functions

Every Lodash function (except internals like `_base*`) is exported as an individual UMD build under `dist/`.

Example paths:

-   `dist/assign.umd.js`
-   `dist/isEqual.umd.js`
-   `dist/debounce.umd.js`
-   ...

## 📜 License

This project is based on Lodash (MIT licensed).  
See [LICENSE](./LICENSE) for details.
