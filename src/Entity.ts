/* eslint-disable no-underscore-dangle */

import { EntityOptions }  from './types/Entity'

export class Entity {
  /**
   * Create an Entity. Provide options in an EntityOptionsObject
   * @param {Object} [options={
   *  verbose: false,
   *  plugins: []
   * }] - An options
   * object
   */

  /**
   * @ignore
   */
  private _options: EntityOptions;
  /**
   * @ignore
   */
  private _schema: any;
  /**
   * @ignore
   */
  private _variants: object;
  /**
   * @ignore
   */
  private _outputs: object;
  /**
   * @ignore
   */
  private _prng: any;

  constructor(options: EntityOptions = {
    verbose: false,
    schema: {},
    variants: {}
  }){
    /**
     * @ignore
     */
    this._options = options;
    /**
     * @ignore
     */
    this._schema = this._options.schema;
    this._prng = options.prng;
    this._variants = options.variants;
    this._outputs = [];
  }

  /**
   * Get the seed that was used in the options object
   * @return {String} Return the seed that was used in the options object or the integer
   * which was generated if a seed was not given.
   */
  get schema() {
    return this._schema;
  }

  /**
   * Get a random integer within a range.
   * @method
   * @param {Object} schema - An object representing this entity's baseline schema.
   * @return {Entity} Return this entity.
   */
  setSchema(schema) {
    this._schema = schema;
    return this;
  }

  get options() {
    return this._options;
  }

  setOptions(options) {
    this._options = Object.assign(this._options, options);
    return this;
  }

  /**
   * Get the seed that was used in the options object
   * @return {String} Return the seed that was used in the options object or the integer
   * which was generated if a seed was not given.
   */
  get variants() {
    return this._variants;
  }

  get outputs() {
    return this._outputs;
  }

  /**
   * Add a variant to the Entity's schema
   * @method
   * @param {Object} variantSchema - An object representing how this object is
   * different from the schema.
   * @return {Entity} Return this entity.
   */
  addVariant(name, variant) {
    this._variants[name] = variant;
    return this;
  }
/*
  /!**
   * Get any outputs that have been loaded into the Entity.
   * @method
   * @param {Object} variantSchema - An object representing how this object is
   * different from the schema.
   * @return {Entity} Return this entity.
   *!/
  get outputs() {
    return this._outputs;
  }*/

  make(num: number = 1, variants = []) {
    var arr: any[] = [];
    // eslint-disable-line prefer-rest-params

    for (let x = num; x > 0; x -= 1) {
      let baseSchema = this._schema(this._prng)
      let variantSchema = variants.map((variant: string) => {
        return this._variants[variant](this._prng)
      })
      arr.push(Object.assign(baseSchema, ...variantSchema));
    }
    return arr.length <= 1 ? arr[0] : arr;
  }
}
//module.exports = Entity;

/**
 * @typedef {Object} Entity~OptionsObject
 * @type Object
 * @param {Number} [rv=null] - A configured RandomValue. If none is provided one will
 * be created using default settings
 * @param {Number} [verbose=false] - Use verbose to get additional console logging information.
 */
