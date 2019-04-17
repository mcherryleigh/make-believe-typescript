import test from 'ava';

//const RandomValue = require('./../src/RandomValue');
import { RandomValue } from '../lib/index';

test('RandomValue - _gen()', (test) => {
  const rv = new RandomValue({ seed: 123 });
  test.is(rv._gen(), 2067261)
})

test('RandomValue - set a seed (positive integer)', (t) => {
  const rv = new RandomValue({ seed: 123 });
  t.is(rv.seed, 123);
  t.is(rv.state, 123);
});

test('RandomValue - set a seed (negative integer)', (t) => {
  const rv = new RandomValue({ seed: -123 });
  t.is(rv.seed, -123);
  t.is(rv.state, -123);
});

test('RandomValue - set a seed and pick next state', (t) => {
  const rv = new RandomValue({ seed: 123 });
  t.is(rv.state, 123);
  t.is(rv.seed, 123);
  rv.random();
  t.is(rv.state, 2067261);
});

test('RandomValue - if a seed isn\'t provided use Date.now()', (t) => {
  const rv = new RandomValue();
  t.true(typeof rv.seed === 'number'); // TODO find better way to test for actual Date.now() number
});

test('RandomValue - if a seed is a string convert it to an int', (t) => {
  const rv = new RandomValue({ seed: 'hello' });
  t.is(rv.seed, 'hello');
  t.is(rv.state, 104101108108111);
});

test('RandomValue - get random()', (t) => {
  const rv = new RandomValue({ seed: 'hello' });
  t.is(rv.random(), 0.3694621996811881);
  t.is(rv.state, 793414032);
});

test('RandomValue - get random() in positive integer range', (t) => {
  const rv = new RandomValue({ seed: 'hello' });
  t.is(rv.random({ min: 4, max: 5}), 4.369462199681188);
  t.is(rv.state, 793414032);
});

test('RandomValue - get random() in negative integer range', (t) => {
  // no seed
  const rv = new RandomValue();
  const num = rv.random({ min: -3, max: -2})
  t.true(num >= -3 && num <= -2);
  //seeded
  const rv2 = new RandomValue({seed: 'hello'});
  t.is(rv2.random({ min: -3, max: -2}), -2.630537800318812);
  t.is(rv2.state, 793414032);
});

test('RandomValue - get random() in mixed integer range', (t) => {
  // no seed
  const rv = new RandomValue();
  const num = rv.random({ min: -3, max: -2})
  t.true(num >= -3 && num <= -2);
  //seeded
  const rv2 = new RandomValue({ seed: 'hello' });
  t.is(rv2.random({ min: -3, max: 3}), -0.7832268019128712);
  t.is(rv2.state, 793414032);
});

test('RandomValue - get random() only includes min', (t) => {
  // no seed
  const rv = new RandomValue();
  const num = rv.random({ min: 0})
  t.true(num >= 0 && num <= 1);
  //seeded
  const rv2 = new RandomValue({ seed: 'hello' });
  t.is(rv2.random({ min: -3}), -1.5221512012752476);
  t.is(rv2.state, 793414032);
});

test('RandomValue - get random() only includes max', (t) => {
  // no seed
  const rv = new RandomValue();
  const num = rv.random({ max: 1})
  t.true(num >= 0 && num <= 1);
  //seeded
  const rv2 = new RandomValue({ seed: 'hello' });
  t.is(rv2.random({ max: 5}), 1.8473109984059404);
  t.is(rv2.state, 793414032);
});


test('RandomValue - get randomInteger()', (t) => {
  const rv = new RandomValue({ seed: 'hello' });
  t.is(rv.randomInteger(), -2351559955494262);
  t.is(rv.randomInteger(), 922157811404133);
  t.is(rv.randomInteger(), 6323618114760343);
});

test('RandomValue - get randomInteger() with max/min', (t) => {
  const rv = new RandomValue({ seed: 123 });
  t.is(rv.randomInteger({ min: -100, max: 100 }), -100);
  t.is(rv.randomInteger({ min: -100, max: 100 }), -64);
  t.is(rv.randomInteger({ min: -100, max: 100 }), 88);
});

test('RandomValue - pick() one', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pick([1,2,3,4,5], 1), 1)
})

test('RandomValue - pick() many', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pick([1,2,3,4,5], 10), [ 1, 1, 5, 3, 3, 5, 4, 3, 3, 5 ])
})

test('RandomValue - pickUnique() one', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pickUnique([1,2,3,4,5], 1), 2)
})

test('RandomValue - pickUnique() many', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pickUnique([1,2,3,4,5],3), [ 2, 4, 3 ])
})

test('RandomValue - pickUnique() more than length', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pickUnique([1,2,3,4,5],100), [ 2, 4, 3, 5, 1 ])
})

test('RandomValue - pickSeries() one', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pickSeries([1,2,3,4,5],1), 1)
})

test('RandomValue - pickSeries() many', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pickSeries([1,2,3,4,5],3), [ 1, 2, 3 ])
})

test('RandomValue - pickSeries() more than length', (t) => {
  const rv = new RandomValue({ seed: 123 })
  t.deepEqual(rv.pickSeries([1,2,3,4,5],6), [ 1, 2, 3, 4, 5, 1 ])
})

test('RandomValue - get times() for class method with no args', (t) => {
  const rv = new RandomValue({ seed: 123 });
  t.deepEqual(
    rv.times(3, rv.random),
    [0.0009626434189093501, 0.1791479416094478, 0.9394546299890869],
  );
});

test('RandomValue - get times() for custom function with no args', (t) => {
  const rv = new RandomValue({ seed: 123 });
  t.deepEqual(
    rv.times(3, args => rv.random(args)),
    [0.0009626434189093501, 0.1791479416094478, 0.9394546299890869],
  );
});

test('RandomValue - addPlugin', (t) => {
  var rv = new RandomValue({ seed: 123 })
  rv = rv.addPlugin({
    name: 'firstName',
    func: function(self) {
      return self.pick(['Bill', 'Bob', 'Barry'], 1)
    }
  })
  t.true(rv.hasOwnProperty('firstName'))
  t.is(rv.firstName(), 'Bill')
})

test('RandomValue - addPlugins', (t) => {
  var rv = new RandomValue({ seed: 123 })
  rv = rv.addPlugins([
      {
        name: 'firstName',
        func: function(self) {
          return self.pick(['Bill', 'Bob', 'Barry'], 1)
        }
      },
      {
        name: 'lastName',
        func: function (self) {
          return self.pick(['Smith', 'Doe', 'Jones'])
        }
      }
    ])
  t.true(rv.hasOwnProperty('firstName'))
  t.true(rv.hasOwnProperty('lastName'))
  t.is(rv.firstName(), 'Bill')
})
