/* eslint no-underscore_dangle: 0 */

import { ClassDef, Options, RandomMethodOptions } from './types/RandomValue'
/**
 * Create a RandomValue generator. Use the OptionsObject
 * to override default behavior.
 * @param {OptionsObject} [options] - An options object to set the seed and
 */
export class RandomValue implements ClassDef {
    /**
     * @ignore
     */
    public seed: any;
    public state: number;
    private _multiplier: number;
    private _constant : number;

    constructor(options: Options = {
        seed: Date.now(),
    }) {
        this.seed = options.seed;
        this._constant = 2147483647;
        this._multiplier = 16807;

        if (typeof options.seed === 'string' || options.seed instanceof String) {
            this.state = Number(options.seed.split('').map(char => char.charCodeAt(0)).join(''));
        } else {
            this.state = this.seed;
        }
    }

    /**
     * @ignore
     */
    _gen() {
        this.state = (this.state * this._multiplier) % this._constant;
        return this.state;
    }

    /**
     * Run a function multiple times and return the result from each run in an array.
     * @param {function} func - A function to run many times.
     * @param {any[]} args - An array of args to pass to the function.
     * @param {number} amount - How many times to run the function.
     * @return {any[]} Return an array of values returned from the method.
     *
     * @example
     * import { RandomValue} from 'make-believe';
     * const rv = RandomValue({ seed: 123 });
     * const rand = rv.times(rv.rand, [], 2);
     * console.log(rand) // [ 0.0009782956922224683, 0.44222351763604534 ]
     */
    times(amount: number = 1, fn) {
        let n = amount;
        let i = n;
        const arr: any[] = [];
        const params = Array
            .prototype
            .slice
            .call(arguments, 2); // eslint-disable-line prefer-rest-params

        for (i = Math.max(0, i) - 1; i >= 0; i -= 1) {
            arr.push(fn.apply(this, params));
        }
        return this._checkArraySize(arr)
    }

    /**
     * @ignore
     */
    _checkArraySize(arr){
        return arr.length <= 1 ? arr[0] : arr;
    }
    /**
     * @ignore
     */
    _double() {
        return (this._gen() / this._constant);
    }

    /**
     * Get a random integer within a range.
     * @param {number} max - The largest floating point number you might generate.
     * If null or undefined, Number.MAX_SAFE_INTEGER will be used instead.
     * @param {number} min - The smallest floating point number you might generate.
     * If null or undefined, Number.MAX_SAFE_INTEGER will be used instead.
     * @return {number} Return a random floating point value.
     *
     * @example
     * import { RandomValue} from 'make-believe';
     * const rv = new RandomValue();
     * const rand = rv.randomInteger(3,-3);
     * console.log(rand) // floating point number between (inclusive) 3, -3
     */
    random(opts: RandomMethodOptions = {max: 1, min: 0}) {
        const options = Object.assign({}, opts);
        const min = Object.prototype.hasOwnProperty.call(options, 'min') && options.min != null ?
            options.min :
            0;
        const max = Object.prototype.hasOwnProperty.call(options, 'max') && options.max != null ?
            options.max :
            1;
        return min + ((max - min) * this._double());
    }

    /**
     * Get a random integer within a range.
     * @param {number} max - The largest integer you might generate.
     * If null or undefined, Number.MAX_SAFE_INTEGER will be used instead.
     * @param {number} min - The smallest integer you might generate.
     * If null or undefined, Number.MAX_SAFE_INTEGER will be used instead.
     * @return {number} Return a random integer value.
     *
     * @example
     * import { RandomValue} from 'make-believe';
     * const rv = new RandomValue();
     * const rand = rv.randomInteger(3,-3);
     * console.log(rand) // one of [-3,-2,-1,0,1,2,3]
     */
    randomInteger(opts: RandomMethodOptions = {}) {
        const options = Object.assign({}, opts);
        const min = Object.prototype.hasOwnProperty.call(options, 'min') && options.min != null ?
            options.min :
            Number.MIN_SAFE_INTEGER;
        const max = Object.prototype.hasOwnProperty.call(options, 'max') && options.max != null ?
            options.max :
            Number.MAX_SAFE_INTEGER;
        const dbl = this._double();
        return Math.round(min + ((max - min) * dbl));
    }

    /**
     * Pick one or more values from an array. Returned values may include duplicates.
     * @param {any[]} pickArray - An array of values to pick from.
     * @param {number} amount - How many values to pick from the array.
     * @return {any|any[]} Return a value or an array of values from the pickArray.
     *
     * @example
     * import { RandomValue} from 'make-believe';
     * const rv = RandomValue({ seed: 123 });
     * const rand1 = rv.pick([1,2,3,4,5,6], 3) ;
     * console.log(rand1) // [ 1, 2, 6 ]
     */
    pick(pickArray: any[] = [], amount: number = 1) {
        return this.times(amount, () => pickArray[Math.floor(this.random() * pickArray.length)]);
    }

    /**
     * Pick one or more values from an array. Returned values will be from uniquely picked indexes.
     * @param {any[]} pickArray - An array of values to pick from.
     * @param {number} amount - How many values to pick from the array.
     * @return {any|any[]} Return a value or an array of values from the pickArray.
     */
    pickUnique(pickArray, amount) {
        const outArray = this.shuffle(pickArray).slice(0, amount);
        return this._checkArraySize(outArray);
    }

    /**
     * Pick one or more values from an array. Returned values may include duplicates.
     * @param {any[]} pickArray - An array of values to pick from.
     * @param {number} amount - How many values to pick from the array.
     * @return {any|any[]} Return a value or an array of values from the pickArray.
     *
     * @example
     * // picking fewer than the length of your array picks items in order
     * import { RandomValue} from 'make-believe';
     * const rv = new RandomValue();
     * const rand1 = rv.pickSeries([1,2,3,4,5,6], 3) ;
     * console.log(rand1) // [ 1, 2, 3 ]
     *
     * @example
     * // picking more than the length of your array will cycle back through the items
     * import { RandomValue} from 'make-believe';
     * const rv = new RandomValue();
     * const rand2 = rv.pickSeries([1,2,3,4,5,6], 9) ;
     * console.log(rand) // [ 1, 2, 3, 4, 5, 6, 1, 2, 3 ]
     */
    pickSeries(pickArray, amount) {
        const totalArrays = Math.floor(amount / pickArray.length);
        const partialArrayLength = amount % pickArray.length;
        const result = [...new Array(totalArrays)]
            .map(() => pickArray)
            .concat(pickArray.slice(0, partialArrayLength));
        return this._checkArraySize([].concat.apply([], result));
    }

    /**
     * Shuffles array in place.
     * @param {any[]} arr - items An array containing the items.
     * @return {any[]} Returns array after it has been shuffled.
     */
    shuffle(arr) {
        let j;
        let x;
        let i;
        for (i = arr.length - 1; i > 0; i -= 1) {
            j = Math.floor(this.random() * (i + 1));
            x = arr[i];
            arr[i] = arr[j]; // eslint-disable-line no-param-reassign
            arr[j] = x; // eslint-disable-line no-param-reassign
            // TODO figure out how to do this without silencing eslint
        }
        return this._checkArraySize(arr);
    }

    addPlugin(plugin) {
        this[plugin.name] = (options) => {
            return plugin.func(this, options)
        }
        return this
    }

    addPlugins(plugins){
        plugins.forEach((plugin) => {
            this.addPlugin(plugin)
        })
        return this;
    }
}
/**
 * A plugin object that can be added to RandomValue.
 * @typedef {Object} RandomValue~PluginObject
 * @property {String} RandomValue~PluginObject.name - The name of your function.
 * This will be used as the method name unless an altName is also provided.
 * @property {String} RandomValue~PluginObject.altName - An override that will be used
 * as the method name for your object
 * @property {function} RandomValue~PluginObject.func - A function returning a value
 * relative to your theme.
 */

/**
 * An options object when instantiating RandomValue.
 * @typedef {Object} RandomValue~OptionsObject
 * @property {number} RandomValue~OptionsObject.seed - The x coordinate.
 * @property {number} RandomValue~OptionsObject.verbose - The x coordinate.
 * @property {PluginObject[]} RandomValue~OptionsObject.plugins - The y coordinate.
 */

//module.exports = RandomValue
