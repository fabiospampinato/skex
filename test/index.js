
/* IMPORT */

import {describe} from 'fava';
import {and, any, array, bigint, boolean, null as _null, nullable, number, object, optional, or, string, symbol, tuple, undefined as _undefined, unknown} from '../dist/index.js';

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
      t.is ( JSON.stringify ( result ), validOrJson );
    } else {
      t.true ( validOrJson );
    }
  }
};

/* MAIN */

describe ( 'Skex', () => {

  describe ( 'all', it => {

    it ( 'forbids multiple identical tests to be used', t => {

      try {

        number ().min ( 123 ).min ( 321 );

      } catch ( error ) {

        t.is ( error.message, 'Duplicated "gte" check' );

      }

    });

    it ( 'supports traversing for default values', t => {

      const schema = object ({
        deep: object ({
          any: any ().default ( 'any' ),
          array: array ().default ( 'array' ),
          bigint: bigint ().default ( 'bigint' ),
          boolean: boolean ().default ( 'boolean' ),
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

      test ( t, schema.nullable (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.nullable (), null, true );

      test ( t, schema.optional (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.optional (), undefined, true );

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

      test ( t, array ().nullable (), [], true );
      test ( t, array ().nullable (), null, true );

      test ( t, array ().optional (), [], true );
      test ( t, array ().optional (), undefined, true );

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

      filter ( t, array ().nullable (), [123], '[123]' );
      filter ( t, array ().nullable (), null, true );

      filter ( t, array ().optional (), [123], '[123]' );
      filter ( t, array ().optional (), undefined, true );

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

      test ( t, bigint ().nullable (), 123n, true );
      test ( t, bigint ().nullable (), null, true );

      test ( t, bigint ().optional (), 123n, true );
      test ( t, bigint ().optional (), undefined, true );

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

      filter ( t, bigint ().nullable (), 123n, true );
      filter ( t, bigint ().nullable (), null, true );
      filter ( t, bigint ().nullable (), 'abc', false );

      filter ( t, bigint ().optional (), 123n, true );
      filter ( t, bigint ().optional (), undefined, true );
      filter ( t, bigint ().optional (), 'abc', false );

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

      test ( t, boolean ().nullable (), false, true );
      test ( t, boolean ().nullable (), null, true );

      test ( t, boolean ().optional (), true, true );
      test ( t, boolean ().optional (), undefined, true );

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

      filter ( t, boolean ().nullable (), true, true );
      filter ( t, boolean ().nullable (), null, true );
      filter ( t, boolean ().nullable (), 'abc', false );

      filter ( t, boolean ().optional (), true, true );
      filter ( t, boolean ().optional (), undefined, true );
      filter ( t, boolean ().optional (), 'abc', false );

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

      test ( t, number ().nullable (), 123, true );
      test ( t, number ().nullable (), null, true );

      test ( t, number ().optional (), 123, true );
      test ( t, number ().optional (), undefined, true );

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

      filter ( t, number ().nullable (), 123, true );
      filter ( t, number ().nullable (), null, true );
      filter ( t, number ().nullable (), 'abc', false );

      filter ( t, number ().optional (), 123, true );
      filter ( t, number ().optional (), undefined, true );
      filter ( t, number ().optional (), 'abc', false );

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

      test ( t, object ().nullable (), {}, true );
      test ( t, object ().nullable (), null, true );

      test ( t, object ().optional (), {}, true );
      test ( t, object ().optional (), undefined, true );

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

      test ( t, schema.nullable (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.nullable (), null, true );

      test ( t, schema.optional (), { foo: 1, bar: 'a' }, true );
      test ( t, schema.optional (), undefined, true );

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

      test ( t, string ().nullable (), '', true );
      test ( t, string ().nullable (), null, true );

      test ( t, string ().optional (), '', true );
      test ( t, string ().optional (), undefined, true );

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

      filter ( t, string ().nullable (), '', true );
      filter ( t, string ().nullable (), null, true );
      filter ( t, string ().nullable (), 123, false );

      filter ( t, string ().optional (), '', true );
      filter ( t, string ().optional (), undefined, true );
      filter ( t, string ().optional (), 123, false );

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

      test ( t, symbol ().nullable (), Symbol (), true );
      test ( t, symbol ().nullable (), null, true );

      test ( t, symbol ().optional (), Symbol (), true );
      test ( t, symbol ().optional (), undefined, true );

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

      filter ( t, symbol ().nullable (), Symbol (), true );
      filter ( t, symbol ().nullable (), null, true );
      filter ( t, symbol ().nullable (), 123, false );

      filter ( t, symbol ().optional (), Symbol (), true );
      filter ( t, symbol ().optional (), undefined, true );
      filter ( t, symbol ().optional (), 123, false );

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

      test ( t, tuple ([ string (), number () ]).nullable (), ['1', 1], true );
      test ( t, tuple ([ string (), number () ]).nullable (), null, true );

      test ( t, tuple ([ string (), number () ]).optional (), ['1', 1], true );
      test ( t, tuple ([ string (), number () ]).optional (), undefined, true );

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

      filter ( t, tuple ().nullable (), [123], '[123]' );
      filter ( t, tuple ().nullable (), null, true );

      filter ( t, tuple ().optional (), [123], '[123]' );
      filter ( t, tuple ().optional (), undefined, true );

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

    });

  });

});
