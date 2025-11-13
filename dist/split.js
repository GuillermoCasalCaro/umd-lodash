/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash include="split" exports="umd" --output .\dist\split.js`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.5';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_SAFE_INTEGER = 9007199254740991;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      nullTag = '[object Null]',
      proxyTag = '[object Proxy]',
      regexpTag = '[object RegExp]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]';

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /** Used to compose unicode character classes. */
  var rsAstralRange = '\\ud800-\\udfff',
      rsComboMarksRange = '\\u0300-\\u036f',
      reComboHalfMarksRange = '\\ufe20-\\ufe2f',
      rsComboSymbolsRange = '\\u20d0-\\u20ff',
      rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
      rsVarRange = '\\ufe0e\\ufe0f';

  /** Used to compose unicode capture groups. */
  var rsAstral = '[' + rsAstralRange + ']',
      rsCombo = '[' + rsComboRange + ']',
      rsFitz = '\\ud83c[\\udffb-\\udfff]',
      rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
      rsNonAstral = '[^' + rsAstralRange + ']',
      rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
      rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
      rsZWJ = '\\u200d';

  /** Used to compose unicode regexes. */
  var reOptMod = rsModifier + '?',
      rsOptVar = '[' + rsVarRange + ']?',
      rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
      rsSeq = rsOptVar + reOptMod + rsOptJoin,
      rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

  /** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
  var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

  /** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
  var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;

  /*--------------------------------------------------------------------------*/

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Converts an ASCII `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function asciiToArray(string) {
    return string.split('');
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /**
   * Checks if `string` contains Unicode symbols.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {boolean} Returns `true` if a symbol is found, else `false`.
   */
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  /**
   * Converts `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function stringToArray(string) {
    return hasUnicode(string)
      ? unicodeToArray(string)
      : asciiToArray(string);
  }

  /**
   * Converts a Unicode `string` to an array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the converted array.
   */
  function unicodeToArray(string) {
    return string.match(reUnicode) || [];
  }

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol,
      symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit method
   * chain sequences. Methods that operate on and return arrays, collections,
   * and functions can be chained together. Methods that retrieve a single value
   * or may return a primitive value will automatically end the chain sequence
   * and return the unwrapped value. Otherwise, the value must be unwrapped
   * with `_#value`.
   *
   * Explicit chain sequences, which must be unwrapped with `_#value`, may be
   * enabled using `_.chain`.
   *
   * The execution of chained methods is lazy, that is, it's deferred until
   * `_#value` is implicitly or explicitly called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion.
   * Shortcut fusion is an optimization to merge iteratee calls; this avoids
   * the creation of intermediate arrays and can greatly reduce the number of
   * iteratee executions. Sections of a chain sequence qualify for shortcut
   * fusion if the section is applied to an array and iteratees accept only
   * one argument. The heuristic for whether a section qualifies for shortcut
   * fusion is subject to change.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers have `Array` and `String` methods.
   *
   * The wrapper `Array` methods are:
   * `concat`, `join`, `pop`, `push`, `shift`, `sort`, `splice`, and `unshift`
   *
   * The wrapper `String` methods are:
   * `replace` and `split`
   *
   * The wrapper methods that support shortcut fusion are:
   * `at`, `compact`, `drop`, `dropRight`, `dropWhile`, `filter`, `find`,
   * `findLast`, `head`, `initial`, `last`, `map`, `reject`, `reverse`, `slice`,
   * `tail`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, and `toArray`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `assignIn`, `assignInWith`, `assignWith`, `at`,
   * `before`, `bind`, `bindAll`, `bindKey`, `castArray`, `chain`, `chunk`,
   * `commit`, `compact`, `concat`, `conforms`, `constant`, `countBy`, `create`,
   * `curry`, `debounce`, `defaults`, `defaultsDeep`, `defer`, `delay`,
   * `difference`, `differenceBy`, `differenceWith`, `drop`, `dropRight`,
   * `dropRightWhile`, `dropWhile`, `extend`, `extendWith`, `fill`, `filter`,
   * `flatMap`, `flatMapDeep`, `flatMapDepth`, `flatten`, `flattenDeep`,
   * `flattenDepth`, `flip`, `flow`, `flowRight`, `fromPairs`, `functions`,
   * `functionsIn`, `groupBy`, `initial`, `intersection`, `intersectionBy`,
   * `intersectionWith`, `invert`, `invertBy`, `invokeMap`, `iteratee`, `keyBy`,
   * `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`, `matchesProperty`,
   * `memoize`, `merge`, `mergeWith`, `method`, `methodOf`, `mixin`, `negate`,
   * `nthArg`, `omit`, `omitBy`, `once`, `orderBy`, `over`, `overArgs`,
   * `overEvery`, `overSome`, `partial`, `partialRight`, `partition`, `pick`,
   * `pickBy`, `plant`, `property`, `propertyOf`, `pull`, `pullAll`, `pullAllBy`,
   * `pullAllWith`, `pullAt`, `push`, `range`, `rangeRight`, `rearg`, `reject`,
   * `remove`, `rest`, `reverse`, `sampleSize`, `set`, `setWith`, `shuffle`,
   * `slice`, `sort`, `sortBy`, `splice`, `spread`, `tail`, `take`, `takeRight`,
   * `takeRightWhile`, `takeWhile`, `tap`, `throttle`, `thru`, `toArray`,
   * `toPairs`, `toPairsIn`, `toPath`, `toPlainObject`, `transform`, `unary`,
   * `union`, `unionBy`, `unionWith`, `uniq`, `uniqBy`, `uniqWith`, `unset`,
   * `unshift`, `unzip`, `unzipWith`, `update`, `updateWith`, `values`,
   * `valuesIn`, `without`, `wrap`, `xor`, `xorBy`, `xorWith`, `zip`,
   * `zipObject`, `zipObjectDeep`, and `zipWith`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clamp`, `clone`,
   * `cloneDeep`, `cloneDeepWith`, `cloneWith`, `conformsTo`, `deburr`,
   * `defaultTo`, `divide`, `each`, `eachRight`, `endsWith`, `eq`, `escape`,
   * `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`, `findLast`,
   * `findLastIndex`, `findLastKey`, `first`, `floor`, `forEach`, `forEachRight`,
   * `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `get`, `gt`, `gte`, `has`,
   * `hasIn`, `head`, `identity`, `includes`, `indexOf`, `inRange`, `invoke`,
   * `isArguments`, `isArray`, `isArrayBuffer`, `isArrayLike`, `isArrayLikeObject`,
   * `isBoolean`, `isBuffer`, `isDate`, `isElement`, `isEmpty`, `isEqual`,
   * `isEqualWith`, `isError`, `isFinite`, `isFunction`, `isInteger`, `isLength`,
   * `isMap`, `isMatch`, `isMatchWith`, `isNaN`, `isNative`, `isNil`, `isNull`,
   * `isNumber`, `isObject`, `isObjectLike`, `isPlainObject`, `isRegExp`,
   * `isSafeInteger`, `isSet`, `isString`, `isUndefined`, `isTypedArray`,
   * `isWeakMap`, `isWeakSet`, `join`, `kebabCase`, `last`, `lastIndexOf`,
   * `lowerCase`, `lowerFirst`, `lt`, `lte`, `max`, `maxBy`, `mean`, `meanBy`,
   * `min`, `minBy`, `multiply`, `noConflict`, `noop`, `now`, `nth`, `pad`,
   * `padEnd`, `padStart`, `parseInt`, `pop`, `random`, `reduce`, `reduceRight`,
   * `repeat`, `result`, `round`, `runInContext`, `sample`, `shift`, `size`,
   * `snakeCase`, `some`, `sortedIndex`, `sortedIndexBy`, `sortedLastIndex`,
   * `sortedLastIndexBy`, `startCase`, `startsWith`, `stubArray`, `stubFalse`,
   * `stubObject`, `stubString`, `stubTrue`, `subtract`, `sum`, `sumBy`,
   * `template`, `times`, `toFinite`, `toInteger`, `toJSON`, `toLength`,
   * `toLower`, `toNumber`, `toSafeInteger`, `toString`, `toUpper`, `trim`,
   * `trimEnd`, `trimStart`, `truncate`, `unescape`, `uniqueId`, `upperCase`,
   * `upperFirst`, `value`, and `words`
   *
   * @name _
   * @constructor
   * @category Seq
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * function square(n) {
   *   return n * n;
   * }
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // Returns an unwrapped value.
   * wrapped.reduce(_.add);
   * // => 6
   *
   * // Returns a wrapped value.
   * var squares = wrapped.map(square);
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /*------------------------------------------------------------------------*/

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * The base implementation of `_.isRegExp` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   */
  function baseIsRegExp(value) {
    return isObjectLike(value) && baseGetTag(value) == regexpTag;
  }

  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseSlice(array, start, end) {
    var index = -1,
        length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Casts `array` to a slice if it's needed.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {number} start The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the cast slice.
   */
  function castSlice(array, start, end) {
    var length = array.length;
    end = end === undefined ? length : end;
    return (!start && end >= length) ? array : baseSlice(array, start, end);
  }

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * Checks if the given arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
   *  else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)
        ) {
      return eq(object[index], value);
    }
    return false;
  }

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `RegExp` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
   * @example
   *
   * _.isRegExp(/abc/);
   * // => true
   *
   * _.isRegExp('/abc/');
   * // => false
   */
  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Splits `string` by `separator`.
   *
   * **Note:** This method is based on
   * [`String#split`](https://mdn.io/String/split).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category String
   * @param {string} [string=''] The string to split.
   * @param {RegExp|string} separator The separator pattern to split by.
   * @param {number} [limit] The length to truncate results to.
   * @returns {Array} Returns the string segments.
   * @example
   *
   * _.split('a-b-c', '-', 2);
   * // => ['a', 'b']
   */
  function split(string, separator, limit) {
    if (limit && typeof limit != 'number' && isIterateeCall(string, separator, limit)) {
      separator = limit = undefined;
    }
    limit = limit === undefined ? MAX_ARRAY_LENGTH : limit >>> 0;
    if (!limit) {
      return [];
    }
    string = toString(string);
    if (string && (
          typeof separator == 'string' ||
          (separator != null && !isRegExp(separator))
        )) {
      separator = baseToString(separator);
      if (!separator && hasUnicode(string)) {
        return castSlice(stringToArray(string), 0, limit);
      }
    }
    return string.split(separator, limit);
  }

  /*------------------------------------------------------------------------*/

  // Add methods that return wrapped values in chain sequences.
  lodash.split = split;

  /*------------------------------------------------------------------------*/

  // Add methods that return unwrapped values in chain sequences.
  lodash.eq = eq;
  lodash.isArray = isArray;
  lodash.isArrayLike = isArrayLike;
  lodash.isFunction = isFunction;
  lodash.isLength = isLength;
  lodash.isObject = isObject;
  lodash.isObjectLike = isObjectLike;
  lodash.isRegExp = isRegExp;
  lodash.isSymbol = isSymbol;
  lodash.toString = toString;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type {string}
   */
  lodash.VERSION = VERSION;

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    // Use `_.noConflict` to remove Lodash from the global object.
    root._ = Object.assign(root._ || {}, lodash);

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return lodash;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = Object.assign(freeModule.exports || {}, lodash))._ = freeModule.exports;
    // Export for CommonJS support.
    freeExports._ = freeModule.exports;
  }
  else {
    // Export to the global object.
    root._ = Object.assign(root._ || {}, lodash);
  }
}.call(this));
