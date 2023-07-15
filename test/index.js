
/* IMPORT */

import {describe} from 'fava';
import {and, any, array, bigint, boolean, deserialize, nillable, null as _null, nullable, number, object, optional, or, record, serialize, string, symbol, tuple, undefined as _undefined, unknown} from '../dist/index.js';

/* HELPERS */

const attempt = fn => {
  try {
    return fn ();
  } catch ( error ) {
    return error;
  }
};

const test = ( t, schema, target, valid ) => {
  t.is ( schema.test ( target ), valid );
};

const filter = ( t, schema, target, validOrJson ) => {
  const result = attempt ( () => schema.filter ( target ) );
  if ( result instanceof Error ) {
    t.false ( validOrJson );
  } else {
    if ( typeof validOrJson === 'string' ) {
      const serialized = typeof result === 'bigint' || typeof result === 'symbol' ? result.toString () : JSON.stringify ( result );
      t.is ( serialized, validOrJson );
    } else {
      t.true ( validOrJson );
    }
  }
};

/* MAIN */

describe ( 'Skex', () => {

  describe ( 'all', it => {

    it ( 'duplicates the default value', t => {

      const fallback = { foo: true };
      const clone = object ().default ( fallback ).filter ( 123 );

      t.not ( fallback, clone );
      t.deepEqual ( fallback, clone );

    });

    it ( 'forbids multiple identical tests to be used', t => {

      try {

        number ().min ( 123 ).min ( 321 );

      } catch ( error ) {

        t.is ( error.message, 'Duplicated "gte" check' );

      }

    });

    it ( 'supports getting a state property', t => {

      const schema = number ().gt ( 1 ).gte ( 2 ).lt ( 3 ).lte ( 4 ).multipleOf ( 5 ).anyOf ( [1, 2] ).noneOf ( [1, 2] );

      t.is ( schema.get ( 'gt' ), 1 );
      t.is ( schema.get ( 'gte' ), 2 );
      t.is ( schema.get ( 'lt' ), 3 );
      t.is ( schema.get ( 'lte' ), 4 );
      t.is ( schema.get ( 'multipleOf' ), 5 );
      t.deepEqual ( schema.get ( 'anyOf' ), [1, 2] );
      t.deepEqual ( schema.get ( 'noneOf' ), [1, 2] );

    });

    it ( 'supports getting the entire state object', t => {

      const schema = number ().gt ( 1 ).gte ( 2 ).lt ( 3 ).lte ( 4 ).multipleOf ( 5 ).anyOf ( [1, 2] ).noneOf ( [3, 4] );

      t.deepEqual ( schema.get (), {
        gt: 1,
        gte: 2,
        lt: 3,
        lte: 4,
        multipleOf: 5,
        anyOf: [1, 2],
        noneOf: [3, 4]
      });

    });

    it ( 'supports serializing and deserializing', t => {

      const schema = array ( bigint ().gt ( 1n ).gte ( 2n ).lt ( 3n ).lte ( 4n ).multipleOf ( 5n ).anyOf ( [1n, 2n] ).noneOf ( [3n, 4n] ) );
      const serialized = '{"$$schema":"array","$$state":{"items":{"$$schema":"bigint","$$state":{"gt":{"$$type":"bigint","$$value":"1"},"gte":{"$$type":"bigint","$$value":"2"},"lt":{"$$type":"bigint","$$value":"3"},"lte":{"$$type":"bigint","$$value":"4"},"multipleOf":{"$$type":"bigint","$$value":"5"},"anyOf":[{"$$type":"bigint","$$value":"1"},{"$$type":"bigint","$$value":"2"}],"noneOf":[{"$$type":"bigint","$$value":"3"},{"$$type":"bigint","$$value":"4"}]}}}}';

      t.is ( serialize ( schema ), serialized );
      t.is ( serialize ( deserialize ( serialize ( schema ) ) ), serialized );

    });

    it ( 'supports traversing for default values', t => {

      const schema = object ({
        deep: object ({
          any: any ().default ( 'any' ),
          array: array ().default ( 'array' ),
          bigint: bigint ().default ( 'bigint' ),
          boolean: boolean ().default ( 'boolean' ),
          nillable: nillable ( number () ).default ( 'nillable' ),
          null: _null ().default ( 'null' ),
          nullable: nullable ( number () ).default ( 'nullable' ),
          number: number ().default ( 'number' ),
          object: object ().default ( 'object' ),
          optional: optional ( number () ).default ( 'optional' ),
          string: string ().default ( 'string' ),
          symbol: symbol ().default ( 'symbol' ),
          tuple: tuple ().default ( 'tuple' ),
          undefined: _undefined ().default ( 'undefined' ),
          unknown: unknown ().default ( 'unknown' )
        })
      });

      const defaults = {
        deep: {
          any: 'any',
          array: 'array',
          bigint: 'bigint',
          boolean: 'boolean',
          nillable: 'nillable',
          null: 'null',
          nullable: 'nullable',
          number: 'number',
          object: 'object',
          optional: 'optional',
          string: 'string',
          symbol: 'symbol',
          tuple: 'tuple',
          undefined: 'undefined',
          unknown: 'unknown'
        }
      };

      const toDefaults = schema => {
        const root = {};
        const values = new Map ();
        schema.traverse ( ( child, parent, key ) => {
          const valueChild = child.get ( 'default' ) || ( parent ? {} : root );
          values.set ( child, valueChild );
          const valueParent = values.get ( parent );
          if ( !valueParent || !key ) return;
          valueParent[key] = valueChild;
        });
        return root;
      };

      t.deepEqual ( toDefaults ( schema ), defaults );

    });

    it ( 'supports traversing for descriptions', t => {

      const schema = object ({
        deep: object ({
          any: any ().description ( 'any' ),
          array: array ().description ( 'array' ),
          bigint: bigint ().description ( 'bigint' ),
          boolean: boolean ().description ( 'boolean' ),
          nillable: nillable ( number () ).description ( 'nillable' ),
          null: _null ().description ( 'null' ),
          nullable: nullable ( number () ).description ( 'nullable' ),
          number: number ().description ( 'number' ),
          object: object ().description ( 'object' ),
          optional: optional ( number () ).description ( 'optional' ),
          string: string ().description ( 'string' ),
          symbol: symbol ().description ( 'symbol' ),
          tuple: tuple ().description ( 'tuple' ),
          undefined: _undefined ().description ( 'undefined' ),
          unknown: unknown ().description ( 'unknown' )
        })
      });

      const descriptions = {
        deep: {
          any: 'any',
          array: 'array',
          bigint: 'bigint',
          boolean: 'boolean',
          nillable: 'nillable',
          null: 'null',
          nullable: 'nullable',
          number: 'number',
          object: 'object',
          optional: 'optional',
          string: 'string',
          symbol: 'symbol',
          tuple: 'tuple',
          undefined: 'undefined',
          unknown: 'unknown'
        }
      };

      const toDescriptions = schema => {
        const root = {};
        const values = new Map ();
        schema.traverse ( ( child, parent, key ) => {
          const valueChild = child.get ( 'description' ) || ( parent ? {} : root );
          values.set ( child, valueChild );
          const valueParent = values.get ( parent );
          if ( !valueParent || !key ) return;
          valueParent[key] = valueChild;
        });
        return root;
      };

      t.deepEqual ( toDescriptions ( schema ), descriptions );

    });

    it ( 'supports lazy schemas', t => {

      const schema = array ( () => schema );

      test ( t, schema, [], true );
      test ( t, schema, [[]], true );
      test ( t, schema, [[[]]], true );
      test ( t, schema, [[[[]]]], true );

      test ( t, schema, [123], false );
      test ( t, schema, [[123]], false );
      test ( t, schema, [[[123]]], false );
      test ( t, schema, [[[[123]]]], false );

    });

  });

  describe ( 'and', it => {

    it ( 'can test', t => {

      const schema = and ([ object ({ foo: number () }), object ({ bar: string () }) ]);
      const known = [{ foo: 1, bar: 'a' }, { foo: 2, bar: 'b' }];

      test ( t, schema, {}, false );
      test ( t, schema, { foo: 123 }, false );
      test ( t, schema, { bar: 'abc' }, false );
      test ( t, schema, { foo: 123, bar: 'abc' }, true );
      test ( t, schema, { foo: 123, bar: 'abc', baz: true }, true );

      test ( t, schema.anyOf ( known ), { foo: 1, bar: 'a' }, true );
      test ( t, schema.anyOf ( known ), { foo: 2, bar: 'b' }, true );
      test ( t, schema.anyOf ( known ), { foo: 3, bar: 'c' }, false );
      test ( t, schema.anyOf ( () => known ), { foo: 2, bar: 'b' }, true );
      test ( t, schema.anyOf ( () => known ), { foo: 3, bar: 'c' }, false );

      test ( t, schema.noneOf ( known ), { foo: 1, bar: 'a' }, false );
      test ( t, schema.noneOf ( known ), { foo: 2, bar: 'b' }, false );
      test ( t, schema.noneOf ( known ), { foo: 3, bar: 'c' }, true );
      test ( t, schema.noneOf ( () => known ), { foo: 2, bar: 'b' }, false );
      test ( t, schema.noneOf ( () => known ), { foo: 3, bar: 'c' }, true );

      test ( t, schema.nillable (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.nillable (), null, true );
      test ( t, schema.nillable (), undefined, true );

      test ( t, schema.nullable (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.nullable (), null, true );
      test ( t, schema.nullable (), undefined, false );

      test ( t, schema.optional (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.optional (), undefined, true );
      test ( t, schema.optional (), null, false );

    });

    it ( 'can not filter', t => {

      filter ( t, and ([ any (), any () ]), {}, false );

    });

  });

  describe ( 'any', it => {

    it ( 'can test', t => {

      test ( t, any (), true, true );
      test ( t, any (), 123, true );
      test ( t, any (), 123n, true );
      test ( t, any (), '', true );
      test ( t, any (), null, true );
      test ( t, any (), undefined, true );
      test ( t, any (), [], true );
      test ( t, any (), {}, true );
      test ( t, any (), function () {}, true );
      test ( t, any (), Symbol (), true );

      test ( t, any ().anyOf ([ 1, 2 ]), 1, true );
      test ( t, any ().anyOf ([ 1, 2 ]), 2, true );
      test ( t, any ().anyOf ([ 1, 2 ]), 3, false );

      test ( t, any ().noneOf ([ 1, 2 ]), 1, false );
      test ( t, any ().noneOf ([ 1, 2 ]), 2, false );
      test ( t, any ().noneOf ([ 1, 2 ]), 3, true );

    });

    it ( 'can filter', t => {

      filter ( t, any (), undefined, true );
      filter ( t, any (), 123, true );
      filter ( t, any (), 'abc', true );
      filter ( t, any (), [], true );
      filter ( t, any (), {}, true );

      filter ( t, any ().anyOf ([ 1, 2 ]), 1, true );
      filter ( t, any ().anyOf ([ 1, 2 ]), 2, true );
      filter ( t, any ().anyOf ([ 1, 2 ]), 3, false );

      filter ( t, any ().noneOf ([ 1, 2 ]), 1, false );
      filter ( t, any ().noneOf ([ 1, 2 ]), 2, false );
      filter ( t, any ().noneOf ([ 1, 2 ]), 3, true );

      filter ( t, any ().default ( 123 ), {}, '{}' );

    });

  });

  describe ( 'array', it => {

    it ( 'can test', t => {

      test ( t, array (), [], true );
      test ( t, array (), new Array (), true );
      test ( t, array (), true, false );
      test ( t, array (), 123, false );
      test ( t, array (), new Date (), false );
      test ( t, array (), {}, false );
      test ( t, array (), '', false );
      test ( t, array (), function () {}, false );

      test ( t, array ().length ( 3 ), [1, 2, 3, 4], false );
      test ( t, array ().length ( 3 ), [1, 2, 3], true );
      test ( t, array ().length ( 3 ), [0], false );
      test ( t, array ().length ( () => 3 ), [1, 2, 3], true );
      test ( t, array ().length ( () => 3 ), [0], false );

      test ( t, array ().min ( 1 ), [], false );
      test ( t, array ().min ( 1 ), [1], true );
      test ( t, array ().min ( 1 ), [1, 2, 3], true );
      test ( t, array ().min ( () => 1 ), [], false );
      test ( t, array ().min ( () => 1 ), [1], true );

      test ( t, array ().max ( 3 ), [1, 2, 3, 4], false );
      test ( t, array ().max ( 3 ), [1, 2, 3], true );
      test ( t, array ().max ( 3 ), [0], true );
      test ( t, array ().max ( () => 3 ), [1, 2, 3, 4], false );
      test ( t, array ().max ( () => 3 ), [1, 2, 3], true );

      test ( t, array ().anyOf ([ [1], [2] ]), [1], true );
      test ( t, array ().anyOf ([ [1], [2] ]), [2], true );
      test ( t, array ().anyOf ([ [1], [2] ]), [2, 2], false );
      test ( t, array ().anyOf ([ [1], [2] ]), [3], false );
      test ( t, array ().anyOf ( () => [[1], [2]] ), [2], true );
      test ( t, array ().anyOf ( () => [[1], [2]] ), [2, 2], false );

      test ( t, array ().noneOf ([ [1], [2] ]), [1], false );
      test ( t, array ().noneOf ([ [1], [2] ]), [2], false );
      test ( t, array ().noneOf ([ [1], [2] ]), [2, 2], true );
      test ( t, array ().noneOf ([ [1], [2] ]), [3], true );
      test ( t, array ().noneOf ( () => [[1], [2]] ), [2], false );
      test ( t, array ().noneOf ( () => [[1], [2]] ), [2, 2], true );

      test ( t, array ( number () ), [], true );
      test ( t, array ( number () ), [1], true );
      test ( t, array ( number () ), [1, 2], true );
      test ( t, array ( number () ), [1, 2, false], false );
      test ( t, array ( number () ), [1, 2, ''], false );
      test ( t, array ( object ({ foo: number ().min ( 2 ) }) ), [], true );
      test ( t, array ( object ({ foo: number ().min ( 2 ) }) ), [{ foo: 1 }], false );
      test ( t, array ( object ({ foo: number ().min ( 2 ) }) ), [{ foo: 2 }], true );
      test ( t, array ( object ({ foo: number ().min ( 2 ) }) ), [{ foo: 2 }, { foo: 3, bar: true }], true );
      test ( t, array ( object ({ foo: number ().min ( 2 ) }) ), [{ foo: 2 }, { foo: 3, bar: true }, false], false );

      test ( t, array ( () => number () ), [1], true );
      test ( t, array ( () => number () ), [1, 2, false], false );
      test ( t, array ( () => object ({ foo: number ().min ( 2 ) }) ), [{ foo: 2 }, { foo: 3, bar: true }], true );
      test ( t, array ( () => object ({ foo: number ().min ( 2 ) }) ), [{ foo: 2 }, { foo: 3, bar: true }, false], false );

      test ( t, array ( or ([ number (), string () ]) ), [], true );
      test ( t, array ( or ([ number (), string () ]) ), [123], true );
      test ( t, array ( or ([ number (), string () ]) ), ['abc'], true );
      test ( t, array ( or ([ number (), string () ]) ), [123, 'abc', 123, 'abc'], true );

      test ( t, array ( object () ), [], true );
      test ( t, array ( object () ), [{}], true );
      test ( t, array ( object ({ foo: boolean () }) ), [], true );
      test ( t, array ( object ({ foo: boolean () }) ), [{}], false );
      test ( t, array ( object ({ foo: boolean () }) ), [{ foo: true }], true );
      test ( t, array ( object ({ foo: boolean () }) ), [{ foo: false }], true );

      test ( t, array ().nillable (), [], true );
      test ( t, array ().nillable (), undefined, true );
      test ( t, array ().nillable (), null, true );

      test ( t, array ().nullable (), [], true );
      test ( t, array ().nullable (), null, true );
      test ( t, array ().nullable (), undefined, false );

      test ( t, array ().optional (), [], true );
      test ( t, array ().optional (), undefined, true );
      test ( t, array ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, array ( string () ), [], '[]' );
      filter ( t, array ( string () ), ['abc', 'def'], '["abc","def"]' );
      filter ( t, array ( string () ), ['abc', 123, 'def', true, []], '["abc","def"]' );

      filter ( t, array ( array ( string () ) ), [], '[]' );
      filter ( t, array ( array ( string () ) ), [['abc', 'def']], '[["abc","def"]]' );
      filter ( t, array ( array ( string () ) ), [['abc', 123, 'def'], ['abc', true]], '[["abc","def"],["abc"]]' );

      filter ( t, array ().length ( 3 ), [1, 2, 3, 4], false );
      filter ( t, array ().length ( 3 ), [1, 2, 3], '[1,2,3]' );

      filter ( t, array ().min ( 1 ), [], false );
      filter ( t, array ().min ( 1 ), [1], '[1]' );

      filter ( t, array ().max ( 3 ), [1, 2, 3, 4], false );
      filter ( t, array ().max ( 3 ), [1, 2, 3], '[1,2,3]' );

      filter ( t, array ().anyOf ([ [1], [2] ]), [1], '[1]' );
      filter ( t, array ().anyOf ([ [1], [2] ]), [3], false );

      filter ( t, array ().noneOf ([ [1], [2] ]), [1], false );
      filter ( t, array ().noneOf ([ [1], [2] ]), [3], '[3]' );

      filter ( t, array ().nillable (), [123], '[123]' );
      filter ( t, array ().nillable (), undefined, true );
      filter ( t, array ().nillable (), null, true );

      filter ( t, array ().nullable (), [123], '[123]' );
      filter ( t, array ().nullable (), null, true );
      filter ( t, array ().nullable (), undefined, false );

      filter ( t, array ().optional (), [123], '[123]' );
      filter ( t, array ().optional (), undefined, true );
      filter ( t, array ().optional (), null, false );

      filter ( t, array ().default ([ 1, 2, 3 ]), [], '[]' );
      filter ( t, array ().default ([ 1, 2, 3 ]), {}, '[1,2,3]' );

    });

  });

  describe ( 'bigint', it => {

    it ( 'can test', t => {

      test ( t, bigint (), null, false );
      test ( t, bigint (), undefined, false );
      test ( t, bigint (), [], false );
      test ( t, bigint (), true, false );
      test ( t, bigint (), 0n, true );
      test ( t, bigint (), 0.123, false );
      test ( t, bigint (), 123n, true );
      test ( t, bigint (), Infinity, false );
      test ( t, bigint (), -0n, true );
      test ( t, bigint (), -0.123, false );
      test ( t, bigint (), -123n, true );
      test ( t, bigint (), -Infinity, false );
      test ( t, bigint (), Object ( BigInt ( 0 ) ), false );
      test ( t, bigint (), NaN, false );
      test ( t, bigint (), new Date (), false );
      test ( t, bigint (), {}, false );
      test ( t, bigint (), '', false );
      test ( t, bigint (), function () {}, false );

      test ( t, bigint ().gt ( 1n ), 0n, false );
      test ( t, bigint ().gt ( 1n ), 1n, false );
      test ( t, bigint ().gt ( 1n ), 3n, true );
      test ( t, bigint ().gt ( () => 1n ), 1n, false );
      test ( t, bigint ().gt ( () => 1n ), 3n, true );

      test ( t, bigint ().gte ( 1n ), 0n, false );
      test ( t, bigint ().gte ( 1n ), 1n, true );
      test ( t, bigint ().gte ( 1n ), 3n, true );
      test ( t, bigint ().gte ( () => 1n ), 0n, false );
      test ( t, bigint ().gte ( () => 1n ), 1n, true );

      test ( t, bigint ().min ( 1n ), 0n, false );
      test ( t, bigint ().min ( 1n ), 1n, true );
      test ( t, bigint ().min ( 1n ), 3n, true );
      test ( t, bigint ().min ( () => 1n ), 0n, false );
      test ( t, bigint ().min ( () => 1n ), 1n, true );

      test ( t, bigint ().lt ( 3n ), 4n, false );
      test ( t, bigint ().lt ( 3n ), 3n, false );
      test ( t, bigint ().lt ( 3n ), 0n, true );
      test ( t, bigint ().lt ( () => 3n ), 3n, false );
      test ( t, bigint ().lt ( () => 3n ), 0n, true );

      test ( t, bigint ().lte ( 3n ), 4n, false );
      test ( t, bigint ().lte ( 3n ), 3n, true );
      test ( t, bigint ().lte ( 3n ), 0n, true );
      test ( t, bigint ().lte ( () => 3n ), 4n, false );
      test ( t, bigint ().lte ( () => 3n ), 3n, true );

      test ( t, bigint ().max ( 3n ), 4n, false );
      test ( t, bigint ().max ( 3n ), 3n, true );
      test ( t, bigint ().max ( 3n ), 0n, true );
      test ( t, bigint ().max ( () => 3n ), 4n, false );
      test ( t, bigint ().max ( () => 3n ), 3n, true );

      test ( t, bigint ().multipleOf ( 2n ), 0n, true );
      test ( t, bigint ().multipleOf ( 2n ), 1n, false );
      test ( t, bigint ().multipleOf ( 2n ), 2n, true );
      test ( t, bigint ().multipleOf ( () => 2n ), 1n, false );
      test ( t, bigint ().multipleOf ( () => 2n ), 2n, true );

      test ( t, bigint ().anyOf ([ 1n, 2n ]), 1n, true );
      test ( t, bigint ().anyOf ([ 1n, 2n ]), 2n, true );
      test ( t, bigint ().anyOf ([ 1n, 2n ]), 3n, false );
      test ( t, bigint ().anyOf ( () => [1n, 2n] ), 2n, true );
      test ( t, bigint ().anyOf ( () => [1n, 2n] ), 3n, false );

      test ( t, bigint ().noneOf ([ 1n, 2n ]), 1n, false );
      test ( t, bigint ().noneOf ([ 1n, 2n ]), 2n, false );
      test ( t, bigint ().noneOf ([ 1n, 2n ]), 3n, true );
      test ( t, bigint ().noneOf ( () => [1n, 2n] ), 2n, false );
      test ( t, bigint ().noneOf ( () => [1n, 2n] ), 3n, true );

      test ( t, bigint ().nillable (), 123n, true );
      test ( t, bigint ().nillable (), null, true );
      test ( t, bigint ().nillable (), undefined, true );

      test ( t, bigint ().nullable (), 123n, true );
      test ( t, bigint ().nullable (), null, true );
      test ( t, bigint ().nullable (), undefined, false );

      test ( t, bigint ().optional (), 123n, true );
      test ( t, bigint ().optional (), undefined, true );
      test ( t, bigint ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, bigint (), 123n, true );
      filter ( t, bigint (), undefined, false );
      filter ( t, bigint (), 'abc', false );
      filter ( t, bigint (), [], false );
      filter ( t, bigint (), {}, false );

      filter ( t, bigint ().anyOf ([ 1n, 2n ]), 3n, false );
      filter ( t, bigint ().anyOf ([ 1n, 2n ]), 2n, true );

      filter ( t, bigint ().noneOf ([ 1n, 2n ]), 3n, true );
      filter ( t, bigint ().noneOf ([ 1n, 2n ]), 2n, false );

      filter ( t, bigint ().nillable (), 123n, true );
      filter ( t, bigint ().nillable (), undefined, true );
      filter ( t, bigint ().nillable (), null, true );
      filter ( t, bigint ().nillable (), 'abc', false );

      filter ( t, bigint ().nullable (), 123n, true );
      filter ( t, bigint ().nullable (), null, true );
      filter ( t, bigint ().nullable (), undefined, false );
      filter ( t, bigint ().nullable (), 'abc', false );

      filter ( t, bigint ().optional (), 123n, true );
      filter ( t, bigint ().optional (), undefined, true );
      filter ( t, bigint ().optional (), null, false );
      filter ( t, bigint ().optional (), 'abc', false );

      filter ( t, bigint ().default ( 123n ), 1n, '1' );
      filter ( t, bigint ().default ( 123n ), {}, '123' );

    });

  });

  describe ( 'boolean', it => {

    it ( 'can test', t => {

      test ( t, boolean (), null, false );
      test ( t, boolean (), undefined, false );
      test ( t, boolean (), [], false );
      test ( t, boolean (), true, true );
      test ( t, boolean (), false, true );
      test ( t, boolean (), new Boolean ( true ), false );
      test ( t, boolean (), new Boolean ( false ), false );
      test ( t, boolean (), 123, false );
      test ( t, boolean (), new Date (), false );
      test ( t, boolean (), {}, false );
      test ( t, boolean (), '', false );
      test ( t, boolean (), function () {}, false );

      test ( t, boolean ().anyOf ( [true] ), true, true );
      test ( t, boolean ().anyOf ( [true] ), false, false );
      test ( t, boolean ().anyOf ( () => [true] ), true, true );
      test ( t, boolean ().anyOf ( () => [true] ), false, false );

      test ( t, boolean ().noneOf ( [true] ), true, false );
      test ( t, boolean ().noneOf ( [true] ), false, true );
      test ( t, boolean ().noneOf ( () => [true] ), true, false );
      test ( t, boolean ().noneOf ( () => [true] ), false, true );

      test ( t, boolean ().nillable (), false, true );
      test ( t, boolean ().nillable (), null, true );
      test ( t, boolean ().nillable (), undefined, true );

      test ( t, boolean ().nullable (), false, true );
      test ( t, boolean ().nullable (), null, true );
      test ( t, boolean ().nullable (), undefined, false );

      test ( t, boolean ().optional (), true, true );
      test ( t, boolean ().optional (), undefined, true );
      test ( t, boolean ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, boolean (), true, true );
      filter ( t, boolean (), false, true );
      filter ( t, boolean (), undefined, false );
      filter ( t, boolean (), 'abc', false );
      filter ( t, boolean (), [], false );
      filter ( t, boolean (), {}, false );

      filter ( t, boolean ().anyOf ( [true] ), false, false );
      filter ( t, boolean ().anyOf ( [true] ), true, true );

      filter ( t, boolean ().noneOf ( [true] ), false, true );
      filter ( t, boolean ().noneOf ( [true] ), true, false );

      filter ( t, boolean ().nillable (), true, true );
      filter ( t, boolean ().nillable (), null, true );
      filter ( t, boolean ().nillable (), undefined, true );
      filter ( t, boolean ().nillable (), 'abc', false );

      filter ( t, boolean ().nullable (), true, true );
      filter ( t, boolean ().nullable (), null, true );
      filter ( t, boolean ().nullable (), undefined, false );
      filter ( t, boolean ().nullable (), 'abc', false );

      filter ( t, boolean ().optional (), true, true );
      filter ( t, boolean ().optional (), undefined, true );
      filter ( t, boolean ().optional (), null, false );
      filter ( t, boolean ().optional (), 'abc', false );

      filter ( t, boolean ().default ( true ), false, 'false' );
      filter ( t, boolean ().default ( true ), {}, 'true' );

    });

  });

  describe ( 'nillable', it => {

    it ( 'can test', t => {

      test ( t, nillable ( number () ), 123, true );
      test ( t, nillable ( number () ), null, true );
      test ( t, nillable ( number () ), undefined, true );
      test ( t, nillable ( number () ), 'abc', false );

      test ( t, nillable ( string () ), 'abc', true );
      test ( t, nillable ( string () ), null, true );
      test ( t, nillable ( string () ), undefined, true );
      test ( t, nillable ( string () ), 123, false );

    });

    it ( 'can filter', t => {

      filter ( t, nillable ( number () ), 123, true );
      filter ( t, nillable ( number () ), null, true );
      filter ( t, nillable ( number () ), undefined, true );
      filter ( t, nillable ( number () ), 'abc', false );

      filter ( t, nillable ( number ().default ( 123 ) ), 0, '0' );
      filter ( t, nillable ( number ().default ( 123 ) ), {}, '123' );
      filter ( t, nillable ( number () ).default ( 123 ), 0, '0' );
      filter ( t, nillable ( number () ).default ( 123 ), {}, '123' );

    });

  });

  describe ( 'null', it => {

    it ( 'can test', t => {

      test ( t, _null (), true, false );
      test ( t, _null (), 123, false );
      test ( t, _null (), 123n, false );
      test ( t, _null (), '', false );
      test ( t, _null (), null, true );
      test ( t, _null (), undefined, false );
      test ( t, _null (), [], false );
      test ( t, _null (), {}, false );

      test ( t, _null ().optional (), null, true );
      test ( t, _null ().optional (), undefined, true );

    });

    it ( 'can filter', t => {

      filter ( t, _null (), null, true );
      filter ( t, _null (), undefined, false );
      filter ( t, _null (), 123, false );
      filter ( t, _null (), 'abc', false );
      filter ( t, _null (), [], false );
      filter ( t, _null (), {}, false );

      filter ( t, _null ().optional (), null, true );
      filter ( t, _null ().optional (), undefined, true );
      filter ( t, _null ().optional (), 123, false );

      filter ( t, _null ().default ( null ), null, 'null' );
      filter ( t, _null ().default ( null ), {}, 'null' );

    });

  });

  describe ( 'nullable', it => {

    it ( 'can test', t => {

      test ( t, nullable ( number () ), 123, true );
      test ( t, nullable ( number () ), null, true );
      test ( t, nullable ( number () ), undefined, false );

      test ( t, nullable ( string () ), 'abc', true );
      test ( t, nullable ( string () ), null, true );
      test ( t, nullable ( string () ), undefined, false );

    });

    it ( 'can filter', t => {

      filter ( t, nullable ( number () ), 123, true );
      filter ( t, nullable ( number () ), null, true );
      filter ( t, nullable ( number () ), undefined, false );
      filter ( t, nullable ( number () ), 'abc', false );

      filter ( t, nullable ( number ().default ( 123 ) ), 0, '0' );
      filter ( t, nullable ( number ().default ( 123 ) ), {}, '123' );
      filter ( t, nullable ( number () ).default ( 123 ), 0, '0' );
      filter ( t, nullable ( number () ).default ( 123 ), {}, '123' );

    });

  });

  describe ( 'number', it => {

    it ( 'can test', t => {

      test ( t, number (), null, false );
      test ( t, number (), undefined, false );
      test ( t, number (), [], false );
      test ( t, number (), true, false );
      test ( t, number (), 0, true );
      test ( t, number (), 0.123, true );
      test ( t, number (), 123, true );
      test ( t, number (), Infinity, true );
      test ( t, number (), -0, true );
      test ( t, number (), -0.123, true );
      test ( t, number (), -123, true );
      test ( t, number (), -Infinity, true );
      test ( t, number (), new Number ( 0 ), false );
      test ( t, number (), NaN, false );
      test ( t, number (), new Date (), false );
      test ( t, number (), {}, false );
      test ( t, number (), '', false );
      test ( t, number (), function () {}, false );

      test ( t, number ().gt ( 1 ), 0, false );
      test ( t, number ().gt ( 1 ), 1, false );
      test ( t, number ().gt ( 1 ), 3, true );
      test ( t, number ().gt ( () => 1 ), 1, false );
      test ( t, number ().gt ( () => 1 ), 3, true );

      test ( t, number ().gte ( 1 ), 0, false );
      test ( t, number ().gte ( 1 ), 1, true );
      test ( t, number ().gte ( 1 ), 3, true );

      test ( t, number ().min ( 1 ), 0, false );
      test ( t, number ().min ( 1 ), 1, true );
      test ( t, number ().min ( 1 ), 3, true );
      test ( t, number ().min ( () => 1 ), 0, false );
      test ( t, number ().min ( () => 1 ), 1, true );

      test ( t, number ().lt ( 3 ), 4, false );
      test ( t, number ().lt ( 3 ), 3, false );
      test ( t, number ().lt ( 3 ), 0, true );
      test ( t, number ().lt ( () => 3 ), 3, false );
      test ( t, number ().lt ( () => 3 ), 0, true );

      test ( t, number ().lte ( 3 ), 4, false );
      test ( t, number ().lte ( 3 ), 3, true );
      test ( t, number ().lte ( 3 ), 0, true );
      test ( t, number ().lte ( () => 3 ), 4, false );
      test ( t, number ().lte ( () => 3 ), 3, true );

      test ( t, number ().max ( 3 ), 4, false );
      test ( t, number ().max ( 3 ), 3, true );
      test ( t, number ().max ( 3 ), 0, true );
      test ( t, number ().max ( () => 3 ), 4, false );
      test ( t, number ().max ( () => 3 ), 3, true );

      test ( t, number ().multipleOf ( 2 ), 0, true );
      test ( t, number ().multipleOf ( 2 ), 1, false );
      test ( t, number ().multipleOf ( 2 ), 2, true );
      test ( t, number ().multipleOf ( () => 2 ), 1, false );
      test ( t, number ().multipleOf ( () => 2 ), 2, true );

      test ( t, number ().anyOf ([ 1, 2 ]), 1, true );
      test ( t, number ().anyOf ([ 1, 2 ]), 2, true );
      test ( t, number ().anyOf ([ 1, 2 ]), 3, false );
      test ( t, number ().anyOf ( () => [1, 2] ), 2, true );
      test ( t, number ().anyOf ( () => [1, 2] ), 3, false );

      test ( t, number ().noneOf ([ 1, 2 ]), 1, false );
      test ( t, number ().noneOf ([ 1, 2 ]), 2, false );
      test ( t, number ().noneOf ([ 1, 2 ]), 3, true );
      test ( t, number ().noneOf ( () => [1, 2] ), 2, false );
      test ( t, number ().noneOf ( () => [1, 2] ), 3, true );

      test ( t, number ().nillable (), 123, true );
      test ( t, number ().nillable (), null, true );
      test ( t, number ().nillable (), undefined, true );

      test ( t, number ().nullable (), 123, true );
      test ( t, number ().nullable (), null, true );
      test ( t, number ().nullable (), undefined, false );

      test ( t, number ().optional (), 123, true );
      test ( t, number ().optional (), undefined, true );
      test ( t, number ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, number (), 123, true );
      filter ( t, number (), undefined, false );
      filter ( t, number (), 'abc', false );
      filter ( t, number (), [], false );
      filter ( t, number (), {}, false );

      filter ( t, number ().anyOf ([ 1, 2 ]), 3, false );
      filter ( t, number ().anyOf ([ 1, 2 ]), 2, true );

      filter ( t, number ().noneOf ([ 1, 2 ]), 3, true );
      filter ( t, number ().noneOf ([ 1, 2 ]), 2, false );

      filter ( t, number ().nillable (), 123, true );
      filter ( t, number ().nillable (), undefined, true );
      filter ( t, number ().nillable (), null, true );
      filter ( t, number ().nillable (), 'abc', false );

      filter ( t, number ().nullable (), 123, true );
      filter ( t, number ().nullable (), null, true );
      filter ( t, number ().nullable (), undefined, false );
      filter ( t, number ().nullable (), 'abc', false );

      filter ( t, number ().optional (), 123, true );
      filter ( t, number ().optional (), undefined, true );
      filter ( t, number ().optional (), null, false );
      filter ( t, number ().optional (), 'abc', false );

      filter ( t, number ().default ( 123 ), 0, '0' );
      filter ( t, number ().default ( 123 ), {}, '123' );

    });

  });

  describe ( 'object', it => {

    it ( 'can test', t => {

      test ( t, object (), [], false );
      test ( t, object (), true, false );
      test ( t, object (), 123, false );
      test ( t, object (), new Date (), false );
      test ( t, object (), {}, true );
      test ( t, object (), new Object (), true );
      test ( t, object (), '', false );
      test ( t, object (), function () {}, false );

      test ( t, object ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true }, true );
      test ( t, object ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: { bar: true } }, true );
      test ( t, object ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true, bar: true }, false );
      test ( t, object ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { bar: true }, false );
      test ( t, object ().anyOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: { bar: true } }, true );
      test ( t, object ().anyOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: true, bar: true }, false );

      test ( t, object ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true }, false );
      test ( t, object ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: { bar: true } }, false );
      test ( t, object ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true, bar: true }, true );
      test ( t, object ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { bar: true }, true );
      test ( t, object ().noneOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: { bar: true } }, false );
      test ( t, object ().noneOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: true, bar: true }, true );

      test ( t, object ().nillable (), {}, true );
      test ( t, object ().nillable (), null, true );
      test ( t, object ().nillable (), undefined, true );

      test ( t, object ().nullable (), {}, true );
      test ( t, object ().nullable (), null, true );
      test ( t, object ().nullable (), undefined, false );

      test ( t, object ().optional (), {}, true );
      test ( t, object ().optional (), undefined, true );
      test ( t, object ().optional (), null, false );

      test ( t, object ({ foo: boolean () }), {}, false );
      test ( t, object ({ foo: boolean () }), { foo: true }, true );
      test ( t, object ({ foo: boolean () }), { foo: false }, true );
      test ( t, object ({ foo: boolean () }), { foo: false, bar: true }, true );
      test ( t, object ({ foo: boolean () }), { foo: 123 }, false );
      test ( t, object ({ foo: object ({ bar: boolean () }) }), {}, false );
      test ( t, object ({ foo: object ({ bar: boolean () }) }), { foo: {} }, false );
      test ( t, object ({ foo: object ({ bar: boolean () }) }), { foo: { bar: true } }, true );
      test ( t, object ({ foo: object ({ bar: boolean () }) }), { foo: { bar: false } }, true );
      test ( t, object ({ foo: object ({ bar: boolean () }) }), { foo: { foo: true } }, false );
      test ( t, object ({ foo: object ({ bar: boolean () }) }), { foo: { bar: 123 } }, false );
      test ( t, object (() => ({ foo: object ({ bar: boolean () }) })), { foo: { bar: true } }, true );
      test ( t, object (() => ({ foo: object ({ bar: boolean () }) })), { foo: { bar: false } }, true );
      test ( t, object (() => ({ foo: object ({ bar: boolean () }) })), { foo: { foo: true } }, false );
      test ( t, object (() => ({ foo: object ({ bar: boolean () }) })), { foo: { bar: 123 } }, false );

      test ( t, object ({ foo: boolean ().optional () }), {}, true );
      test ( t, object ({ foo: boolean ().optional () }), { foo: true }, true );
      test ( t, object ({ foo: object ({ bar: boolean ().optional () }) }), {}, false );
      test ( t, object ({ foo: object ({ bar: boolean ().optional () }) }), { foo: {} }, true );
      test ( t, object ({ foo: object ({ bar: boolean ().optional () }) }), { foo: { bar: true } }, true );

      test ( t, object ({ foo: array ( object ({ bar: object ({ deep: number () }) }) ) }), { foo: [] }, true );
      test ( t, object ({ foo: array ( object ({ bar: object ({ deep: number () }) }) ) }), { foo: {} }, false );
      test ( t, object ({ foo: array ( object ({ bar: object ({ deep: number () }) }) ) }), { foo: [{ bar: { deep: 123 } }] }, true );
      test ( t, object ({ foo: array ( object ({ bar: object ({ deep: number () }) }) ) }), { foo: [{ bar: { deep: false } }] }, false );
      test ( t, object ({ foo: array ( object ({ bar: object ({ deep: number () }) }) ) }), { foo: [{ bar: 123 }] }, false );

      // test ( t, object ({ '/^[a-z]+$/': boolean () }), { foo123: 123 }, true );
      // test ( t, object ({ '/^[a-z]+$/': boolean () }), { foo: 123 }, false );
      // test ( t, object ({ '/^[a-z]+$/': boolean () }), { foo: true }, true );
      // test ( t, object ({ '/^[a-z]+$/': boolean () }), { foo: false }, true );

      test ( t, object ({ foo: boolean () }), {}, false );
      test ( t, object ({ foo: boolean () }), { foo: {} }, false );
      test ( t, object ({ foo: boolean () }), { foo: true }, true );
      test ( t, object ({ foo: object ({ bar: object ({ deep: boolean () }) }) }), { foo: {} }, false );
      test ( t, object ({ foo: object ({ bar: object ({ deep: boolean () }) }) }), { foo: { bar: {} } }, false );
      test ( t, object ({ foo: object ({ bar: object ({ deep: boolean () }) }) }), { foo: { bar: { deep: true } } }, true );

    });

    it ( 'can filter', t => {

      filter ( t, object ({ foo: number () }), {}, false );
      filter ( t, object ({ foo: number () }), { foo: 123 }, '{"foo":123}' );
      filter ( t, object ({ foo: number () }), { foo: 'abc' }, false );
      filter ( t, object ({ foo: number () }), { bar: 123 }, false );
      filter ( t, object ({ foo: number () }), { foo: 123, bar: 'abc' }, '{"foo":123}' );

      filter ( t, object ({ foo: number ().optional () }), {}, '{}' );
      filter ( t, object ({ foo: number ().optional () }), { foo: 123 }, '{"foo":123}' );
      filter ( t, object ({ foo: number ().optional () }), { foo: 'abc' }, '{}' );
      filter ( t, object ({ foo: number ().optional () }), { bar: 123 }, '{}' );
      filter ( t, object ({ foo: number ().optional () }), { foo: 123, bar: 'abc' }, '{"foo":123}' );

      // filter ( t, object ({ foo: number () }), {}, false );
      // filter ( t, object ({ foo: number () }), { foo: 123 }, '{"foo":123}' );
      // filter ( t, object ({ foo: number () }), { foo: 123, baz: 'abc' }, '{"foo":123}' );

      // filter ( object ({ foo: object ({ bar: number () }) }), {}, '{}' );
      // filter ( object ({ foo: object ({ bar: number () }) }), { extra: true }, {} );
      // filter ( object ({ foo: object ({ bar: number () }) }), { foo: 123 }, {} );
      // filter ( object ({ foo: object ({ bar: number () }) }), { foo: {} }, { foo: {} } );
      // filter ( object ({ foo: object ({ bar: number () }) }), { foo: { bar: true } }, { foo: {} } );
      // filter ( object ({ foo: object ({ bar: number () }) }), { foo: { bar: 123 } }, { foo: { bar: 123 } } );

      // filter ( object ({ foo: object ({ bar: number () () }) }), {}, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) }), { extra: true }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) }), { foo: 123 }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) }), { foo: {} }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) }), { foo: { bar: true } }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) }), { foo: { bar: 123 } }, { foo: { bar: 123 } } );
      // filter ( object ({ foo: object ({ bar: number () }) () }), {}, {} );
      // filter ( object ({ foo: object ({ bar: number () }) () }), { extra: true }, {} );
      // filter ( object ({ foo: object ({ bar: number () }) () }), { foo: 123 }, {} );
      // filter ( object ({ foo: object ({ bar: number () }) () }), { foo: {} }, { foo: {} } );
      // filter ( object ({ foo: object ({ bar: number () }) () }), { foo: { bar: true } }, { foo: {} } );
      // filter ( object ({ foo: object ({ bar: number () }) () }), { foo: { bar: 123 } }, { foo: { bar: 123 } } );
      // filter ( object ({ foo: object ({ bar: number () () }) () }), {}, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) () }), { extra: true }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) () }), { foo: 123 }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) () }), { foo: {} }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) () }), { foo: { bar: true } }, {} );
      // filter ( object ({ foo: object ({ bar: number () () }) () }), { foo: { bar: 123 } }, { foo: { bar: 123 } } );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), {}, {} );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), { foo: {} }, {} );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), { foo: { bar: {} } }, {} );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), { foo: { bar: { baz: {} } } }, {} );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), { foo: { bar: { baz: { deep: {} } } } }, {} );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), { foo: { bar: { baz: { deep: 123 } } } }, {} );
      // filter ( object ({ foo: object ({ bar: object ({ baz: object ({ deep: boolean () () }) () }) () }) () }), { foo: { bar: { baz: { deep: true } } } }, { foo: { bar: { baz: { deep: true } } } } );

      filter ( t, object ().default ({ foo: 123 }), {}, '{}' );
      filter ( t, object ().default ({ foo: 123 }), [], '{"foo":123}' );

    });

  });

  describe ( 'optional', it => {

    it ( 'can test', t => {

      test ( t, optional ( number () ), 123, true );
      test ( t, optional ( number () ), undefined, true );
      test ( t, optional ( number () ), null, false );

      test ( t, optional ( string () ), 'abc', true );
      test ( t, optional ( string () ), undefined, true );
      test ( t, optional ( string () ), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, optional ( number () ), 123, true );
      filter ( t, optional ( number () ), undefined, true );
      filter ( t, optional ( number () ), null, false );
      filter ( t, optional ( number () ), 'abc', false );

      filter ( t, optional ( number ().default ( 123 ) ), 0, '0' );
      filter ( t, optional ( number ().default ( 123 ) ), {}, '123' );
      filter ( t, optional ( number () ).default ( 123 ), 0, '0' );
      filter ( t, optional ( number () ).default ( 123 ), {}, '123' );

    });

  });

  describe ( 'or', it => {

    it ( 'can test', t => {

      const schema = or ([ object ({ foo: number () }), object ({ bar: string () }) ]);
      const known = [{ foo: 1, bar: 'a' }, { foo: 2, bar: 'b' }];

      test ( t, schema, {}, false );
      test ( t, schema, { foo: 123 }, true );
      test ( t, schema, { bar: 'abc' }, true );
      test ( t, schema, { foo: 123, bar: true }, true );
      test ( t, schema, { foo: true, bar: 'abc' }, true );
      test ( t, schema, { foo: 123, bar: 'abc' }, true );
      test ( t, schema, { foo: 123, bar: 'abc', baz: true }, true );

      test ( t, schema.anyOf ( known ), { foo: 1, bar: 'a' }, true );
      test ( t, schema.anyOf ( known ), { foo: 2, bar: 'b' }, true );
      test ( t, schema.anyOf ( known ), { foo: 3, bar: 'c' }, false );
      test ( t, schema.anyOf ( () => known ), { foo: 2, bar: 'b' }, true );
      test ( t, schema.anyOf ( () => known ), { foo: 3, bar: 'c' }, false );

      test ( t, schema.noneOf ( known ), { foo: 1, bar: 'a' }, false );
      test ( t, schema.noneOf ( known ), { foo: 2, bar: 'b' }, false );
      test ( t, schema.noneOf ( known ), { foo: 3, bar: 'c' }, true );
      test ( t, schema.noneOf ( () => known ), { foo: 2, bar: 'b' }, false );
      test ( t, schema.noneOf ( () => known ), { foo: 3, bar: 'c' }, true );

      test ( t, schema.nillable (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.nillable (), null, true );
      test ( t, schema.nillable (), undefined, true );

      test ( t, schema.nullable (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.nullable (), null, true );
      test ( t, schema.nullable (), undefined, false );

      test ( t, schema.optional (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.optional (), undefined, true );
      test ( t, schema.optional (), null, false );

    });

    it ( 'can filter primitives', t => {

      filter ( t, or ([ number (), string () ]), 123, true );
      filter ( t, or ([ number (), string () ]), 'abc', true );
      filter ( t, or ([ number (), string () ]), true, false );

      filter ( t, or ([ number ().default ( 123 ), string ().default ( 'abc' ) ]).default ( 999 ), 0, '0' );
      filter ( t, or ([ number ().default ( 123 ), string ().default ( 'abc' ) ]).default ( 999 ), 'a', '"a"' );
      filter ( t, or ([ number ().default ( 123 ), string ().default ( 'abc' ) ]).default ( 999 ), {}, '999' );

    });

    it ( 'can not filter non-primitives', t => {

      filter ( t, or ([ or ([ any (), any () ]) ]), 123, false );

    });

  });

  describe ( 'record', it => {

    it ( 'can test', t => {

      test ( t, record (), {}, true );
      test ( t, record ( or ([ number (), boolean () ]) ), {}, true );
      test ( t, record ( or ([ number (), boolean () ]) ), { foo: 123 }, true );
      test ( t, record ( or ([ number (), boolean () ]) ), { foo: true }, true );
      test ( t, record ( or ([ number (), boolean () ]) ), { foo: false }, true );
      test ( t, record ( or ([ number (), boolean () ]) ), { foo: true, baz: 123 }, true );
      test ( t, record ( or ([ number (), boolean () ]) ), { foo: true, baz: true }, true );
      test ( t, record ( or ([ number (), boolean () ]) ), { foo: true, baz: 'abc' }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), {}, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: 123 }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: true }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: false }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: true, baz: 123 }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: true, baz: true }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: true, baz: 'abc' }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true, b: 123 }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true, b: true }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true, b: 'abc' }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: 123 }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: false }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true, baz: 123 }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true, baz: true }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: true, baz: 'abc' }, false );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: 123 }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: true }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: false }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: true, baaaz: 123 }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: true, baaaz: true }, true );
      test ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: true, baaaz: 'abc' }, false );

      test ( t, record ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true }, true );
      test ( t, record ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: { bar: true } }, true );
      test ( t, record ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true, bar: true }, false );
      test ( t, record ().anyOf ([ { foo: true }, { foo: { bar: true } } ]), { bar: true }, false );
      test ( t, record ().anyOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: { bar: true } }, true );
      test ( t, record ().anyOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: true, bar: true }, false );

      test ( t, record ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true }, false );
      test ( t, record ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: { bar: true } }, false );
      test ( t, record ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { foo: true, bar: true }, true );
      test ( t, record ().noneOf ([ { foo: true }, { foo: { bar: true } } ]), { bar: true }, true );
      test ( t, record ().noneOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: { bar: true } }, false );
      test ( t, record ().noneOf ( () => [{ foo: true }, { foo: { bar: true } }] ), { foo: true, bar: true }, true );

      test ( t, record ().nillable (), {}, true );
      test ( t, record ().nillable (), null, true );
      test ( t, record ().nillable (), undefined, true );

      test ( t, record ().nullable (), {}, true );
      test ( t, record ().nullable (), null, true );
      test ( t, record ().nullable (), undefined, false );

      test ( t, record ().optional (), {}, true );
      test ( t, record ().optional (), undefined, true );
      test ( t, record ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, record (), {}, '{}' );
      filter ( t, record ( or ([ number (), boolean () ]) ), {}, '{}' );
      filter ( t, record ( or ([ number (), boolean () ]) ), { foo: 123 }, '{"foo":123}' );
      filter ( t, record ( or ([ number (), boolean () ]) ), { foo: true }, '{"foo":true}' );
      filter ( t, record ( or ([ number (), boolean () ]) ), { foo: 123, bar: 321 }, '{"foo":123,"bar":321}' );
      filter ( t, record ( or ([ number (), boolean () ]) ), { foo: 123, bar: false }, '{"foo":123,"bar":false}' );
      filter ( t, record ( or ([ number (), boolean () ]) ), { foo: 'abc' }, '{}' );
      filter ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), {}, '{}' );
      filter ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { f: 123 }, '{}' );
      filter ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: 123 }, '{"foo":123}' );
      filter ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foo: 123, bar: 321 }, '{"foo":123,"bar":321}' );
      filter ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: 123 }, '{"foooo":123}' );
      filter ( t, record ( string ().min ( 3 ), or ([ number (), boolean () ]) ), { foooo: 123, baaar: 321 }, '{"foooo":123,"baaar":321}' );

      filter ( t, record ( number () ).anyOf ([ { foo: 1 }, { foo: 2 } ]), { foo: 3 }, false );
      filter ( t, record ( number () ).anyOf ([ { foo: 1 }, { foo: 2 } ]), { foo: 2 }, '{"foo":2}' );

      filter ( t, record ( number () ).noneOf ([ { foo: 1 }, { foo: 2 } ]), { foo: 3 }, '{"foo":3}' );
      filter ( t, record ( number () ).noneOf ([ { foo: 1 }, { foo: 2 } ]), { foo: 2 }, false );

      filter ( t, record ( number () ).nillable (), { foo: 123 }, '{"foo":123}' );
      filter ( t, record ( number () ).nillable (), null, true );
      filter ( t, record ( number () ).nillable (), undefined, true );
      filter ( t, record ( number () ).nillable (), { foo: 'abc' }, '{}' );

      filter ( t, record ( number () ).nullable (), { foo: 123 }, '{"foo":123}' );
      filter ( t, record ( number () ).nullable (), null, true );
      filter ( t, record ( number () ).nullable (), undefined, false );
      filter ( t, record ( number () ).nullable (), { foo: 'abc' }, '{}' );

      filter ( t, record ( number () ).optional (), { foo: 123 }, '{"foo":123}' );
      filter ( t, record ( number () ).optional (), undefined, true );
      filter ( t, record ( number () ).optional (), null, false );
      filter ( t, record ( number () ).optional (), { foo: 'abc' }, '{}' );

      filter ( t, record ().default ({ foo: 123 }), {}, '{}' );
      filter ( t, record ().default ({ foo: 123 }), [], '{"foo":123}' );

    });

  });

  describe ( 'string', it => {

    it ( 'can test', t => {

      test ( t, string (), null, false );
      test ( t, string (), undefined, false );
      test ( t, string (), [], false );
      test ( t, string (), true, false );
      test ( t, string (), 123, false );
      test ( t, string (), new Date (), false );
      test ( t, string (), {}, false );
      test ( t, string (), '', true );
      test ( t, string (), 'aaa', true );
      test ( t, string (), new String (), false );
      test ( t, string (), function () {}, false );

      test ( t, string ().length ( 3 ), 'aaaa', false );
      test ( t, string ().length ( 3 ), 'aaa', true );
      test ( t, string ().length ( 3 ), '', false );
      test ( t, string ().length ( () => 3 ), 'aaa', true );
      test ( t, string ().length ( () => 3 ), '', false );

      test ( t, string ().min ( 1 ), '', false );
      test ( t, string ().min ( 1 ), 'a', true );
      test ( t, string ().min ( 1 ), 'aaa', true );
      test ( t, string ().min ( () => 1 ), '', false );
      test ( t, string ().min ( () => 1 ), 'a', true );

      test ( t, string ().max ( 3 ), 'aaaa', false );
      test ( t, string ().max ( 3 ), 'aaa', true );
      test ( t, string ().max ( 3 ), '', true );
      test ( t, string ().max ( () => 3 ), 'aaaa', false );
      test ( t, string ().max ( () => 3 ), 'aaa', true );

      test ( t, string ().matches ( /^\d+$/ ), '123', true );
      test ( t, string ().matches ( /^\d+$/ ), 'a123a', false );

      test ( t, string ().matches ( value => value.includes ( '123' ) ), '123', true );
      test ( t, string ().matches ( value => value.includes ( '123' ) ), 'a123a', true );
      test ( t, string ().matches ( value => value.includes ( '123' ) ), 'a122a', false );

      test ( t, string ().anyOf ([ '1', '2' ]), '1', true );
      test ( t, string ().anyOf ([ '1', '2' ]), '2', true );
      test ( t, string ().anyOf ([ '1', '2' ]), '3', false );
      test ( t, string ().anyOf ( () => ['1', '2'] ), '2', true );
      test ( t, string ().anyOf ( () => ['1', '2'] ), '3', false );

      test ( t, string ().noneOf ([ '1', '2' ]), '1', false );
      test ( t, string ().noneOf ([ '1', '2' ]), '2', false );
      test ( t, string ().noneOf ([ '1', '2' ]), '3', true );
      test ( t, string ().noneOf ( () => ['1', '2'] ), '2', false );
      test ( t, string ().noneOf ( () => ['1', '2'] ), '3', true );

      test ( t, string ().nillable (), '', true );
      test ( t, string ().nillable (), null, true );
      test ( t, string ().nillable (), undefined, true );

      test ( t, string ().nullable (), '', true );
      test ( t, string ().nullable (), null, true );
      test ( t, string ().nullable (), undefined, false );

      test ( t, string ().optional (), '', true );
      test ( t, string ().optional (), undefined, true );
      test ( t, string ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, string (), '', true );
      filter ( t, string (), undefined, false );
      filter ( t, string (), 123, false );
      filter ( t, string (), [], false );
      filter ( t, string (), {}, false );

      filter ( t, string ().anyOf ([ '1', '2' ]), '3', false );
      filter ( t, string ().anyOf ([ '1', '2' ]), '2', true );

      filter ( t, string ().noneOf ([ '1' ,'2' ]), '3', true );
      filter ( t, string ().noneOf ([ '1' ,'2' ]), '2', false );

      filter ( t, string ().nillable (), '', true );
      filter ( t, string ().nillable (), null, true );
      filter ( t, string ().nillable (), undefined, true );
      filter ( t, string ().nillable (), 123, false );

      filter ( t, string ().nullable (), '', true );
      filter ( t, string ().nullable (), null, true );
      filter ( t, string ().nullable (), undefined, false );
      filter ( t, string ().nullable (), 123, false );

      filter ( t, string ().optional (), '', true );
      filter ( t, string ().optional (), undefined, true );
      filter ( t, string ().optional (), null, false );
      filter ( t, string ().optional (), 123, false );

      filter ( t, string ().default ( 'abc' ), '123', '"123"' );
      filter ( t, string ().default ( 'abc' ), 123, '"abc"' );

    });

  });

  describe ( 'symbol', it => {

    it ( 'can test', t => {

      test ( t, symbol (), null, false );
      test ( t, symbol (), undefined, false );
      test ( t, symbol (), [], false );
      test ( t, symbol (), true, false );
      test ( t, symbol (), false, false );
      test ( t, symbol (), 123, false );
      test ( t, symbol (), new Date (), false );
      test ( t, symbol (), {}, false );
      test ( t, symbol (), '', false );
      test ( t, symbol (), function () {}, false );
      test ( t, symbol (), Symbol (), true );
      test ( t, symbol (), Symbol.iterator, true );

      test ( t, symbol ().anyOf ( [Symbol.iterator] ), Symbol.asyncIterator, false );
      test ( t, symbol ().anyOf ( [Symbol.iterator] ), Symbol.iterator, true );
      test ( t, symbol ().anyOf ( () => [Symbol.iterator] ), Symbol.asyncIterator, false );
      test ( t, symbol ().anyOf ( () => [Symbol.iterator] ), Symbol.iterator, true );

      test ( t, symbol ().noneOf ( [Symbol.iterator] ), Symbol.asyncIterator, true );
      test ( t, symbol ().noneOf ( [Symbol.iterator] ), Symbol.iterator, false );
      test ( t, symbol ().noneOf ( () => [Symbol.iterator] ), Symbol.asyncIterator, true );
      test ( t, symbol ().noneOf ( () => [Symbol.iterator] ), Symbol.iterator, false );

      test ( t, symbol ().nillable (), Symbol (), true );
      test ( t, symbol ().nillable (), null, true );
      test ( t, symbol ().nillable (), undefined, true );

      test ( t, symbol ().nullable (), Symbol (), true );
      test ( t, symbol ().nullable (), null, true );
      test ( t, symbol ().nullable (), undefined, false );

      test ( t, symbol ().optional (), Symbol (), true );
      test ( t, symbol ().optional (), undefined, true );
      test ( t, symbol ().optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, symbol (), Symbol (), true );
      filter ( t, symbol (), undefined, false );
      filter ( t, symbol (), 123, false );
      filter ( t, symbol (), 'abc', false );
      filter ( t, symbol (), [], false );
      filter ( t, symbol (), {}, false );

      filter ( t, symbol ().anyOf ( [Symbol.iterator] ), Symbol.asyncIterator, false );
      filter ( t, symbol ().anyOf ( [Symbol.iterator] ), Symbol.iterator, true );

      filter ( t, symbol ().noneOf ( [Symbol.iterator] ), Symbol.asyncIterator, true );
      filter ( t, symbol ().noneOf ( [Symbol.iterator] ), Symbol.iterator, false );

      filter ( t, symbol ().nillable (), Symbol (), true );
      filter ( t, symbol ().nillable (), null, true );
      filter ( t, symbol ().nillable (), undefined, true );
      filter ( t, symbol ().nillable (), 123, false );

      filter ( t, symbol ().nullable (), Symbol (), true );
      filter ( t, symbol ().nullable (), null, true );
      filter ( t, symbol ().nullable (), undefined, false );
      filter ( t, symbol ().nullable (), 123, false );

      filter ( t, symbol ().optional (), Symbol (), true );
      filter ( t, symbol ().optional (), undefined, true );
      filter ( t, symbol ().optional (), null, false );
      filter ( t, symbol ().optional (), 123, false );

      filter ( t, symbol ().default ( Symbol.iterator ), Symbol.asyncIterator, 'Symbol(Symbol.asyncIterator)' );
      filter ( t, symbol ().default ( Symbol.iterator ), {}, 'Symbol(Symbol.iterator)' );

    });

  });

  describe ( 'tuple', it => {

    it ( 'can test', t => {

      test ( t, tuple (), [], true );
      test ( t, tuple (), new Array (), true );
      test ( t, tuple (), [123, 'abc'], true );
      test ( t, tuple (), true, false );
      test ( t, tuple (), 123, false );
      test ( t, tuple (), new Date (), false );
      test ( t, tuple (), {}, false );
      test ( t, tuple (), '', false );
      test ( t, tuple (), function () {}, false );

      test ( t, tuple ([ string (), number () ]), ['asd', 123], true );
      test ( t, tuple ([ string (), number () ]), ['asd', 123, 123], false );
      test ( t, tuple ([ string (), number () ]), ['asd', 123, undefined], false );
      test ( t, tuple ([ string (), number () ]), [123, 'asd'], false );
      test ( t, tuple ([ string (), number () ]), ['asd'], false );
      test ( t, tuple ([ string (), number () ]), [123], false );

      test ( t, tuple ([ string ().optional (), number ().optional () ]), ['asd', 123], true );
      test ( t, tuple ([ string ().optional (), number ().optional () ]), ['asd', 123, 123], false );
      test ( t, tuple ([ string ().optional (), number ().optional () ]), ['asd', 123, undefined], false );
      test ( t, tuple ([ string ().optional (), number ().optional () ]), [123, 'asd'], false );
      test ( t, tuple ([ string ().optional (), number ().optional () ]), ['asd'], true );
      test ( t, tuple ([ string ().optional (), number ().optional () ]), [123], false );

      test ( t, tuple ([ string ().optional (), number ().optional () ]), ['asd'], true );
      test ( t, tuple ([ string ().optional (), number ().optional () ]), ['asd', undefined], true );
      test ( t, tuple ([ string ().optional (), number ().optional () ]).length ( 2 ), ['asd'], false );
      test ( t, tuple ([ string ().optional (), number ().optional () ]).length ( 2 ), ['asd', undefined], true );
      test ( t, tuple ([ string ().optional (), number ().optional () ]).length ( () => 2 ), ['asd'], false );
      test ( t, tuple ([ string ().optional (), number ().optional () ]).length ( () => 2 ), ['asd', undefined], true );

      test ( t, tuple ([ string (), number () ]).anyOf ([ ['1', 1], ['2', 2] ]), ['1', 1], true );
      test ( t, tuple ([ string (), number () ]).anyOf ([ ['1', 1], ['2', 2] ]), ['2', 2], true );
      test ( t, tuple ([ string (), number () ]).anyOf ([ ['1', 1], ['2', 2] ]), ['3', 3], false );
      test ( t, tuple ([ string (), number () ]).anyOf ([ ['1', 1], ['2', 2] ]), [3], false );
      test ( t, tuple ([ string (), number () ]).anyOf ( () => [['1', 1], ['2', 2]] ), ['2', 2], true );
      test ( t, tuple ([ string (), number () ]).anyOf ( () => [['1', 1], ['2', 2]] ), ['3', 3], false );

      test ( t, tuple ([ string (), number () ]).noneOf ([ ['1', 1], ['2', 2] ]), ['1', 1], false );
      test ( t, tuple ([ string (), number () ]).noneOf ([ ['1', 1], ['2', 2] ]), ['2', 2], false );
      test ( t, tuple ([ string (), number () ]).noneOf ([ ['1', 1], ['2', 2] ]), ['3', 3], true );
      test ( t, tuple ([ string (), number () ]).noneOf ([ ['1', 1], ['2', 2] ]), [3], false );
      test ( t, tuple ([ string (), number () ]).noneOf ( () => [['1', 1], ['2', 2]] ), ['2', 2], false );
      test ( t, tuple ([ string (), number () ]).noneOf ( () => [['1', 1], ['2', 2]] ), ['3', 3], true );

      test ( t, tuple (), [], true );
      test ( t, tuple (), undefined, false );
      test ( t, tuple ([ object () ]), [], false );
      test ( t, tuple ([ object () ]), [{}], true );
      test ( t, tuple ([ object ({ foo: boolean () }) ]), [], false );
      test ( t, tuple ([ object ({ foo: boolean () }) ]), [{}], false );
      test ( t, tuple ([ object ({ foo: boolean () }) ]), [{ foo: true }], true );
      test ( t, tuple ([ object ({ foo: boolean () }) ]), [{ foo: false }], true );

      test ( t, tuple ([ string (), number () ]).nillable (), ['1', 1], true );
      test ( t, tuple ([ string (), number () ]).nillable (), null, true );
      test ( t, tuple ([ string (), number () ]).nillable (), undefined, true );

      test ( t, tuple ([ string (), number () ]).nullable (), ['1', 1], true );
      test ( t, tuple ([ string (), number () ]).nullable (), null, true );
      test ( t, tuple ([ string (), number () ]).nullable (), undefined, false );

      test ( t, tuple ([ string (), number () ]).optional (), ['1', 1], true );
      test ( t, tuple ([ string (), number () ]).optional (), undefined, true );
      test ( t, tuple ([ string (), number () ]).optional (), null, false );

    });

    it ( 'can filter', t => {

      filter ( t, tuple ([ string () ]), [], false );
      filter ( t, tuple ([ string () ]), ['abc', 'def'], false );
      filter ( t, tuple ([ string () ]), ['abc'], '["abc"]' );

      filter ( t, tuple ([ array ( string () ) ]), [], false );
      filter ( t, tuple ([ array ( string () ) ]), [[]], '[[]]' );
      filter ( t, tuple ([ array ( string () ) ]), [['abc']], '[["abc"]]' );
      filter ( t, tuple ([ array ( string () ) ]), [['abc', 123, 'def', true]], '[["abc","def"]]' );

      filter ( t, tuple ().length ( 3 ), [1, 2, 3, 4], false );
      filter ( t, tuple ().length ( 3 ), [1, 2, 3], '[1,2,3]' );

      filter ( t, tuple ().anyOf ([ [1], [2] ]), [1], '[1]' );
      filter ( t, tuple ().anyOf ([ [1], [2] ]), [3], false );

      filter ( t, tuple ().noneOf ([ [1], [2] ]), [1], false );
      filter ( t, tuple ().noneOf ([ [1], [2] ]), [3], '[3]' );

      filter ( t, tuple ().nillable (), [123], '[123]' );
      filter ( t, tuple ().nillable (), null, true );
      filter ( t, tuple ().nillable (), undefined, true );

      filter ( t, tuple ().nullable (), [123], '[123]' );
      filter ( t, tuple ().nullable (), null, true );
      filter ( t, tuple ().nullable (), undefined, false );

      filter ( t, tuple ().optional (), [123], '[123]' );
      filter ( t, tuple ().optional (), undefined, true );
      filter ( t, tuple ().optional (), null, false );

      filter ( t, tuple ().default ([ 1, 2, 3 ]), [], '[]' );
      filter ( t, tuple ().default ([ 1, 2, 3 ]), {}, '[1,2,3]' );

    });

  });

  describe ( 'undefined', it => {

    it ( 'can test', t => {

      test ( t, _undefined (), true, false );
      test ( t, _undefined (), 123, false );
      test ( t, _undefined (), 123n, false );
      test ( t, _undefined (), '', false );
      test ( t, _undefined (), null, false );
      test ( t, _undefined (), undefined, true );
      test ( t, _undefined (), [], false );
      test ( t, _undefined (), {}, false );

      test ( t, _undefined ().nullable (), null, true );
      test ( t, _undefined ().nullable (), undefined, true );

    });

    it ( 'can filter', t => {

      filter ( t, _undefined (), undefined, true );
      filter ( t, _undefined (), null, false );
      filter ( t, _undefined (), 123, false );
      filter ( t, _undefined (), 'abc', false );
      filter ( t, _undefined (), [], false );
      filter ( t, _undefined (), {}, false );

      filter ( t, _undefined ().nullable (), null, true );
      filter ( t, _undefined ().nullable (), undefined, true );
      filter ( t, _undefined ().nullable (), 123, false );

    });

  });

  describe ( 'unknown', it => {

    it ( 'can test', t => {

      test ( t, unknown (), true, true );
      test ( t, unknown (), 123, true );
      test ( t, unknown (), 123n, true );
      test ( t, unknown (), '', true );
      test ( t, unknown (), null, true );
      test ( t, unknown (), undefined, true );
      test ( t, unknown (), [], true );
      test ( t, unknown (), {}, true );
      test ( t, unknown (), function () {}, true );
      test ( t, unknown (), Symbol (), true );

      test ( t, unknown ().anyOf ([ 1, 2 ]), 1, true );
      test ( t, unknown ().anyOf ([ 1, 2 ]), 2, true );
      test ( t, unknown ().anyOf ([ 1, 2 ]), 3, false );
      test ( t, unknown ().anyOf ( () => [1, 2] ), 2, true );
      test ( t, unknown ().anyOf ( () => [1, 2] ), 3, false );

      test ( t, unknown ().noneOf ([ 1, 2 ]), 1, false );
      test ( t, unknown ().noneOf ([ 1, 2 ]), 2, false );
      test ( t, unknown ().noneOf ([ 1, 2 ]), 3, true );
      test ( t, unknown ().noneOf ( () => [1, 2] ), 2, false );
      test ( t, unknown ().noneOf ( () => [1, 2] ), 3, true );

    });

    it ( 'can filter', t => {

      filter ( t, unknown (), undefined, true );
      filter ( t, unknown (), 123, true );
      filter ( t, unknown (), 'abc', true );
      filter ( t, unknown (), [], true );
      filter ( t, unknown (), {}, true );

      filter ( t, unknown ().anyOf ([ 1, 2 ]), 1, true );
      filter ( t, unknown ().anyOf ([ 1, 2 ]), 2, true );
      filter ( t, unknown ().anyOf ([ 1, 2 ]), 3, false );

      filter ( t, unknown ().noneOf ([ 1, 2 ]), 1, false );
      filter ( t, unknown ().noneOf ([ 1, 2 ]), 2, false );
      filter ( t, unknown ().noneOf ([ 1, 2 ]), 3, true );

      filter ( t, unknown ().default ( 123 ), {}, '{}' );

    });

  });

});
