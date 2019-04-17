import test from 'ava';

import { Entity, RandomValue } from '../lib';

test('Entity.setSchema() - set a schema', (t) => {
  const e = new Entity().setSchema({ hello: 'world' });
  t.deepEqual(e.schema, { hello: 'world' });
});

test('Entity.setOptions() - reset options', (t) => {
  const e = new Entity().setOptions({ verbose: true });
  t.deepEqual(e.options, { schema: {}, verbose: true, variants: {} });
});

test('make one entity from baseSchema', (t) => {
  const rv = new RandomValue({seed: 'hello'})
  const e = new Entity({
    prng: rv,
    schema: function(prng){
      return {
        hello: prng.pick([1,2,3,4,5])
      }
    }
  })
  t.deepEqual(e.make(1), {hello: 2})
})

test('make many entities from baseSchema', (t) => {
  const rv = new RandomValue({seed: 'hello'})
  const e = new Entity({
    prng: rv,
    schema: function(prng){
      return {
        hello: prng.pick([1,2,3,4,5])
      }
    }
  })
  t.deepEqual(e.make(3), [{hello: 2},{hello: 3},{hello: 5}])
})

test('make one entity from baseSchema + single variant', (t) => {
  const rv = new RandomValue({seed: 'hello'})
  const e = new Entity({
    prng: rv,
    schema: function(prng){
      return {
        hello: prng.pick([1,2,3,4,5])
      }
    },
    variants: {
      helloGoodbye: function(prng) {
        return {
          hello: 'goodbye'
        }
      }
    }
  })
  t.deepEqual(e.make(1, ['helloGoodbye']), {hello: 'goodbye'})
})

test('make one entity from baseSchema + many variants', (t) => {
  const rv = new RandomValue({seed: 'hello'})
  const e = new Entity({
    prng: rv,
    schema: function(prng){
      return {
        hello: prng.pick([1,2,3,4,5])
      }
    },
    variants: {
      helloGoodbye: function(prng) {
        return {
          hello: 'goodbye'
        }
      },
      newProp: function(prng) {
        return {
          plusOne: 1
        }
      },
      newPick: function(prng) {
        return {
          pickly: prng.pick([3,2,1])
        }
      }
    }
  })
  t.deepEqual(
      e.make(1, ['helloGoodbye', 'newProp', 'newPick']),
      {hello: 'goodbye', plusOne: 1, pickly: 2})
})

test('make one entity from baseSchema + many variants with overlapping props', (t) => {
  const rv = new RandomValue({seed: 'hello'})
  const e = new Entity({
    prng: rv,
    schema: function(prng){
      return {
        hello: prng.pick([1,2,3,4,5])
      }
    },
    variants: {
      helloGoodbye: function(prng) {
        return {
          hello: 'goodbye'
        }
      },
      helloWorld: function(prng) {
        return {
          hello: 'world'
        }
      }
    }
  })
  t.deepEqual(
      e.make(1, ['helloGoodbye', 'helloWorld']),
      {hello: 'world'})
})

test('Entity - getVariants()', (t) => {
  const e = new Entity({
    variants: {
      helloGoodbye: function(prng) {
        return {
          hello: 'goodbye'
        }
      },
      helloWorld: function(prng) {
        return {
          hello: 'world'
        }
      }
    }
  })
  t.true(
      e.variants.hasOwnProperty('helloGoodbye') &&
      e.variants.hasOwnProperty('helloWorld')
  )
})

test('Entity - addVariant()', (t) => {
  const e = new Entity()
  e.addVariant('helloGoodbye', function(prng) {
    return {
      hello: 'goodbye'
    }
  })
  t.true(e.variants.hasOwnProperty('helloGoodbye'))
  t.deepEqual(e.variants.helloGoodbye(), {hello: 'goodbye'})
})
/*test('Entity.addVariant() - add new variant', (t) => {
  const e = new Entity().addVariant({ different: 'schema' });
  t.deepEqual(e.variants, [{ different: 'schema' }]);
});*/

/*test('Entity.addOutput() - add new output', (t) => {
  const e = new Entity().addOutputs({ output: 'somewhere' });
  t.deepEqual(e.outputs, [{ output: 'somewhere' }]);
});*/
