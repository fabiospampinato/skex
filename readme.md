# Skex

A modern schema validation and filtration library with great TypeScript support.

## Install

```sh
npm install --save skex
```

## APIs

| [Primitive Ops](#primitive-ops) | [Compound Ops](#compound-ops) | [Type Ops](#type-ops) | [Utilities](#utilities)       | [Types](#types)     |
| ------------------------------- | ----------------------------- | --------------------- | ----------------------------- | ------------------- |
| [`bigint`](#bigint)             | [`array`](#array)             | [`any`](#any)         | [`serialize`](#serialize)     | [`Infer`](#infer)   |
| [`boolean`](#boolean)           | [`tuple`](#tuple)             | [`unknown`](#unknown) | [`deserialize`](#deserialize) | [`Schema`](#schema) |
| [`null`](#null)                 | [`object`](#object)           |                       |                               |                     |
| [`number`](#number)             | [`record`](#record)           |                       |                               |                     |
| [`string`](#string)             | [`nillable`](#nillable)       |                       |                               |                     |
| [`symbol`](#symbol)             | [`nullable`](#nullable)       |                       |                               |                     |
| [`undefined`](#undefined)       | [`optional`](#optional)       |                       |                               |                     |
|                                 | [`and`](#and)                 |                       |                               |                     |
|                                 | [`or`](#or)                   |                       |                               |                     |

## Usage

This library provides various operators, or "ops" for short, which are the building blocks used to construct a schema. A schema is a graph of operators, which are the nodes in this graph. Each operator has various chainable immutable APIs used to customize it, and it can have a default value and a description.

The main methods that each operator has, which are also the main functionality of this library, are:

- `test`: the test method basically uses a schema as a type guard, it tells you if an arbitrary value matches the schema structurally according to TypeScript, i.e. like in TypeScript extra properties are allowed as long as the type of the schema matches. The input value is not mutated in any way.
- `filter`: the filter method basically tries to extract the biggest subset of the input value that matches the schema. For example imagine you have a schema for your app's settings, you want to get all the valid settings out of the object, but if there happens to be an invalid setting in the object that shouldn't cause the entire object to be considered invalid. Basically invalid properties are deleted from the input object until what remains is a valid object, or an error is thrown if that's not possible. The input object can be mutated, even if the call ultimately ends up throwing an error.
- `traverse`: the traverse method allows you to do something for each operator node found traversing the given node. This is fairly powerful but a bit of a niche and escape-hatch kind of feature.

Some basic examples:

```ts
import {boolean, number, object, string} from 'skex';

// Let's create a simple schema that matches a number between 0 and 10 inclusive

const schema1 = number ().min ( 0 ).max ( 10 );

// Schemas are immutable, they are cloned when made more specific

schema1.multipleOf ( 5 ) !== schema1; // => true

// Almost every operator supports all of the following APIs

schema1.anyOf ([ 1, 2, 3 ]); // Allow only the provided values
schema1.noneOf ([ 1, 2, 3 ]); // Disallow the provided values
schema1.nillable (); // Allows for matching also null | undefined
schema1.nullable (); // Allows for matching also null
schema1.optional (); // Allows for matching also undefined

schema1.default ( 123 ); // Sets a default value to fallback to when filtering and receiving "undefined" as input
schema1.description ( 'Some description' ); // Set a description for this schema

// Configuring multiple identical modifiers on the same schema is disallowed and will case the library to throw

schema1.multipleOf ( 5 ).multipleOf ( 10 ); // => throws an error

// The internal state of each operator can be retrieved

schema1.get (); // => { min: 0, max: 10 }
schema1.get ( 'min' ); // => 0
schema1.get ( 'max' ); // => 10
schema1.get ( 'multipleOf' ); // => undefined

// Let's test if an arbitrary input matches this schema

schema1.test ( 0 ); // => true
schema1.test ( 5 ); // => true
schema1.test ( 10 ); // => true

schema1.test ( 100 ); // => false
schema1.test ( -10 ); // => false
schema1.test ( 'abc' ); // => false

// Let's filter an input according to this schema, which for primitive ops effectively means throwing if the input doesn't match

schema1.filter ( 0 ); // => 0
schema1.filter ( 5 ); // => 5
schema1.filter ( 10 ); // => 10

schema1.filter ( 100 ); // => throws an error
schema1.filter ( -10 ); // => throws an error
schema1.filter ( 'abc' ); // => throws an error

// Let's create a more complicated schema for matching settings
// Notice how every property is also marked as optional, as we don't want to throw out the entire input object if a single one of these properties is missing or invalid

const schema2 = object ({
  editor: object ({
    autosave: object ({
      enabled: boolean ().default ( true ).description ( 'Whether autosaving is enabled or not' ).optional (),
      interval: number ().default ( 60_000 ).description ( 'The mount of time to wait between autosaves' ).optional ()
    }).optional (),
    cursor: object ({
      animated: boolean ().default ( false ).description ( 'Whether the cursor should move smoothly between positions or not' ).optional (),
      blinking: string ().anyOf ([ 'blink', 'smooth', 'phase', 'expand', 'solid' ]).default ( 'blink' ).description ( 'The style used for blinking cursors' ).optional (),
      style: string ().anyOf ([ 'line', 'block', 'underline' ]).default ( 'line' ).description ( 'The style used for rendering cursors' ).optional ()
    }).optional ()
  }).optional ()
});

// Let's match some objects against this more complicated schema

schema2.test ( {} ); // => true

schema2.test ({ // => true
  editor: {
    autosave: {
      enabled: true
    }
  }
});

schema2.test ({ // => true
  editor: {
    cursor: {
      animated: true,
      blinking: 'phase',
      style: 'underline'
    }
  },
  extraProperty: {
    whatever: true
  }
});

schema2.test ({ // false
  editor: {
    cursor: {
      animated: 'nope'
    }
  }
});

schema2.test ({ // false
  editor: {
    cursor: {
      blinking: 'no-blinking'
    }
  }
});

// Let's filter an object against this more complicate schema

const filtered = schema2.filter ({
  editor: {
    cursor: {
      animated: true,
      blinking: 'phase',
      style: 'pixelated'
    }
  },
  extraProperty: {
    whatever: true
  }
});
// {
//   editor: {
//     cursor: {
//       animated: true,
//       blinking: 'phase'
//     }
//   }
// }

// Let's traverse this schema

schema2.traverse ( ( child, parent, key ) => {
  console.log ( 'current node:', child ); // Callback called once for each operator node ("child" here) in the graph
  console.log ( 'parent node:', parent ); // All nodes have a parent except for the root one being traversed
  console.log ( 'parent key:', key ); // Some child nodes have a parent but they are not attached on a key on the parent, like schemas passed to the "and" operator
});
```

## Primitive Ops

Primitive operators are the leaf nodes in your schema graph, they don't take any other operators as input, they just match a single value.

#### `bigint`

This op matches a single [BigInt](https://developer.mozilla.org/en-US/docs/Glossary/BigInt).

```ts
import {bigint} from 'skex';

bigint (); // Matches a bigint

bigint ().gt ( 5n ); // Matches a bigint that is > 5n
bigint ().gte ( 5n ); // Matches a bigint that is >= 5n
bigint ().min ( 5n ); // Matches a bigint that is >= 5n
bigint ().lt ( 5n ); // Matches a bigint that is < 5n
bigint ().lte ( 5n ); // Matches a bigint that is <= 5n
bigint ().max ( 5n ); // Matches a bigint that is <= 5n
bigint ().multipleOf ( 5n ); // Matches a bigint that is a multiple of 5n

bigint ().anyOf ([ 1n, 2n, 3n ]); // Matches a bigint that is either 1n, 2n or 3n
bigint ().noneOf ([ 1n, 2n, 3n ]); // Matches a bigint that is neither 1n, 2n nor 3n
bigint ().nillable (); // Matches bigint | null | undefined
bigint ().nullable (); // Matches bigint | null
bigint ().optional (); // Matches bigint | undefined
```

#### `boolean`

This op matches a single [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean).

```ts
import {boolean} from 'skex';

boolean (); // Matches a boolean

boolean ().anyOf ([ true ]); // Matches a boolean that is true
boolean ().noneOf ([ true ]); // Matches a boolean that is not true
boolean ().nillable (); // Matches boolean | null | undefined
boolean ().nullable (); // Matches boolean | null
boolean ().optional (); // Matches boolean | undefined
```

#### `null`

This op matches a single [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null).

```ts
import {null} from 'skex';

null (); // Matches null
null ().optional (); // Matches null | undefined
```

#### `number`

This op matches a single [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number).

```ts
import {number} from 'skex';

number (); // Matches a number

number ().gt ( 5 ); // Matches a number that is > 5
number ().gte ( 5 ); // Matches a number that is >= 5
number ().min ( 5 ); // Matches a number that is >= 5
number ().lt ( 5 ); // Matches a number that is < 5
number ().lte ( 5 ); // Matches a number that is <= 5
number ().max ( 5 ); // Matches a number that is <= 5
number ().multipleOf ( 5 ); // Matches a number that is a multiple of 5

number ().anyOf ([ 1, 2, 3 ]); // Matches a number that is either 1, 2 or 3
number ().noneOf ([ 1, 2, 3 ]); // Matches a number that is neither 1, 2 nor 3
number ().nillable (); // Matches number | null | undefined
number ().nullable (); // Matches number | null
number ().optional (); // Matches number | undefined
```

#### `string`

This op matches a single [String](https://developer.mozilla.org/en-US/docs/Glossary/String).

```ts
import {string} from 'skex';

string (); // Matches a string

string ().length ( 3 ); // Matches a string of length === 3
string ().min ( 3 ); // Matches a string of length <= 3
string ().max ( 3 ); // Matches a string of length >= 3
string ().matches ( /abc/i ); // Matches a string that matches the regex
string ().matches ( isLowercase ); // Matches a string for which this function returns true

string ().anyOf ([ 'a', 'b', 'c' ]); // Matches a string that is either 'a', 'b' or 'c'
string ().noneOf ([ 'a', 'b', 'c' ]); // Matches a string that is neither 'a', 'b' nor 'c'
string ().nillable (); // Matches string | null | undefined
string ().nullable (); // Matches string | null
string ().optional (); // Matches string | undefined
```

#### `symbol`

This op matches a single [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).

```ts
import {symbol} from 'skex';

symbol (); // Matches a symbol

symbol ().anyOf ([ Symbol.iterator, Symbol.asyncIterator ]); // Matches a symbol that is either Symbol.iterator or Symbol.asyncIterator
symbol ().noneOf ([ Symbol.iterator, Symbol.asyncIterator ]); // Matches a symbol that is neither Symbol.iterator nor Symbol.asyncIterator
symbol ().nillable (); // Matches symbol | null | undefined
symbol ().nullable (); // Matches symbol | null
symbol ().optional (); // Matches symbol | undefined
```

#### `undefined`

This op matches a single [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined).

```ts
import {undefined} from 'skex';

undefined (); // Matches undefined
undefined ().nullable (); // Matches undefined | null
```

## Compound Ops

Compound operators are the internal nodes in your schema graph, they take as input other operators, and combine them to create more complicated schemas.

#### `array`

This op matches a single [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), optionally matching all of its items against another schema.

```ts
import {array, number} from 'skex';

array (); // Matches an array with any items
array ( number () ); // Matches an array with number items

array ().length ( 3 ); // Matches an array of length === 3
array ().min ( 3 ); // Matches an array of length <= 3
array ().max ( 3 ); // Matches an array of length >= 3
array ().items ( number () ); // Matches an array with number items

array ().anyOf ([ [1, 2], ['a', 'b'] ]); // Matches an array that is either [1, 2] or ['a', 'b']
array ().noneOf ([ [1, 2], ['a', 'b'] ]); // Matches an array that is neither [1, 2] nor ['a', 'b']
array ().nillable (); // Matches unknown[] | null | undefined
array ().nullable (); // Matches unknown[] | null
array ().optional (); // Matches unknown[] | undefined
```

#### `tuple`

This op matches a single [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), but where the exact type and index of each item in the array is matched explicit also.

```ts
import {tuple, boolean, number, string} from 'skex';

tuple (); // Matches an array with any items
tuple ([ number (), string (), boolean () ]); // Matches [number, string, boolean]
tuple ([ number (), string ().optional () ]) // Matches [number, string] | [number, undefined] | [number]

tuple ().length ( 3 ); // Matches an array of length === 3
tuple ().min ( 3 ); // Matches an array of length <= 3
tuple ().max ( 3 ); // Matches an array of length >= 3
tuple ().items ([ number (), string () ]); // Matches [number, string]

tuple ().anyOf ([ [1, 2], ['a', 'b'] ]); // Matches an array that is either [1, 2] or ['a', 'b']
tuple ().noneOf ([ [1, 2], ['a', 'b'] ]); // Matches an array that is neither [1, 2] nor ['a', 'b']
tuple ().nillable (); // Matches unknown[] | null | undefined
tuple ().nullable (); // Matches unknown[] | null
tuple ().optional (); // Matches unknown[] | undefined
```

#### `object`

This op matches a single [Plain Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), optionally matching each explicitly provided property with a specific schema.

```ts
import {object, number, string} from 'skex';

object (); // Matches an object with any properties
object ({ foo: number ().optional (), bar: string ().optional () }); // Matches { foo?: number, bar?: string }
object ().properties ({ foo: number () }); // Matches { foo: number }

object ().anyOf ([ { foo: 123 }, { bar: 'abc' } ]); // Matches an object that is either { foo: 123 } or { bar: 'abc' }
object ().noneOf ([ { foo: 123 }, { bar: 'abc' } ]); // Matches an object that is neither { foo: 123 } nor { bar: 'abc' }
object ().nillable (); // Matches {} | null | undefined
object ().nullable (); // Matches {} | null
object ().optional (); // Matches {} | undefined
```

#### `record`

This op matches a single [Plain Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object), where all values, and optionally all keys also, are matches against specific schemas.

```ts
import {record, number, string} from 'skex';

record (); // Matches an object with any properties
record ( number () ); // Matches a Record<string, number>
record ( string ().min ( 3 ), number () ); // Matches a Record<string, number> where keys' lengths are >= 3

record ().anyOf ([ { foo: 123 }, { bar: 'abc' } ]); // Matches an object that is either { foo: 123 } or { bar: 'abc' }
record ().noneOf ([ { foo: 123 }, { bar: 'abc' } ]); // Matches an object that is neither { foo: 123 } nor { bar: 'abc' }
record ().nillable (); // Matches Record<string, unknown> | null | undefined
record ().nullable (); // Matches Record<string, unknown> | null
record ().optional (); // Matches Record<string, unknown> | undefined
```

#### `nillable`

This op accepts [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined) and [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) additionally to the type matched by the provided schema.

```ts
import {nillable, number} from 'skex';

nillable ( number () ); // Matches number | null | undefined
```

#### `nullable`

This op accepts [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) additionally to the type matched by the provided schema.

```ts
import {nullable, number} from 'skex';

nullable ( number () ); // Matches number | null
```

#### `optional`

This op accepts [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined) additionally to the type matched by the provided schema.

```ts
import {optional, number} from 'skex';

optional ( number () ); // Matches number | undefined
```

#### `and`

This op matches multiple schemas on the same value at the same time.

```ts
import {and, number, object, string} from 'skex';

and ([ string ().matches ( /aaa/ ), string ().matches ( /bbb/ ) ]); // Matches a string that matches both regexes
and ([ object ({ foo: number () }), object ({ bar: string () }) ]); // Matches { foo: number, bar: string }

and ([ object ({ foo: number () }), object ({ bar: string () }) ]).anyOf ([ { foo: 1, bar: 'a' }, { foo: 2, bar: 'b' } ]); // Matches { foo: number, bar: string } but only if { foo: 1, bar: 'a' } or { foo: 2, bar: 'b' }
and ([ object ({ foo: number () }), object ({ bar: string () }) ]).noneOf ([ { foo: 1, bar: 'a' }, { foo: 2, bar: 'b' } ]); // Matches { foo: number, bar: string } but only if not { foo: 1, bar: 'a' } nor { foo: 2, bar: 'b' }
and ([ object ({ foo: number () }), object ({ bar: string () }) ]).nillable (); // Matches { foo: number, bar: string } | null | undefined
and ([ object ({ foo: number () }), object ({ bar: string () }) ]).nullable (); // Matches { foo: number, bar: string } | null
and ([ object ({ foo: number () }), object ({ bar: string () }) ]).optional (); // Matches { foo: number, bar: string } | undefined
```

#### `or`

This op matches at least one of the provided schemas on the provided value.

```ts
import {or, number, string} from 'skex';

or ([ string (), number () ]); // Matches string | number

or ([ string (), number () ]).anyOf ([ 1, 2, 'a', 'b' ]); // Matches a string | number that is either 1, 2, 'a' or 'b'
or ([ string (), number () ]).noneOf ([ 1, 2, 'a', 'b' ]); // Matches a string | number that is neither 1, 2, 'a' nor 'b'
or ([ string (), number () ]).nillable (); // Matches string | number | null | undefined
or ([ string (), number () ]).nullable (); // Matches string | number | null
or ([ string (), number () ]).optional (); // Matches string | number | undefined
```

## Type Ops

Special primitive operators that match values with a specific TypeScript-only type.

#### `any`

This op matches any value, and it asserts it's value to be of type `any`.

```ts
import {any} from 'skex';

any (); // Matches anything as any

any ().anyOf ([ 1, 2, 3 ]); // Matches anything as any, but allows only 1, 2 or 3
any ().noneOf ([ 1, 2, 3 ]); // Matches anything as any, but disallows 1, 2 and 3
```

#### `unknown`

This op matches any value, and it asserts it's value to be of type `unknown`.

```ts
import {unknown} from 'skex';

unknown (); // Matches anything as unknown

unknown ().anyOf ([ 1, 2, 3 ]); // Matches anything as unknown, but allows only 1, 2 or 3
unknown ().noneOf ([ 1, 2, 3 ]); // Matches anything as unknown, but disallows 1, 2 and 3
```

## Utilities

Utilities are not operators, so they are not part of your schemas, but they do useful things with your schemas.

#### `serialize`

This utility serializes an arbitrary schema to a string.

Any schema can be serialized to a string, unless it references symbols or functions, since those can't always be serialized to a string.

Among other things serialization can be used to pass a schema between different worker threads.

```ts
import {serialize, number} from 'skex';

serialize ( number ().min ( 3 ) ); // => '{"$$schema":"number","$$state":{"gte":3}}'
```

#### `deserialize`

This utility deserializes a serialized schema back to into a usable schema.

Any serialized schema can be deserialized, unless you are using custom schema ops (for now).

```ts
import {serialize, deserialize, number} from 'skex';

const serialized = serialize ( number ().min ( 3 ) ); // => '{"$$schema":"number","$$state":{"gte":3}}'
const deserialized = deserialize ( serialized ); // => Basically a clone of number ().min ( 3 )
```

## Types

The following types are provided to better use the library.

#### `Infer`

This type allows you to extract the type that a schema matches.

Basically it allows you to convert a schema into a type.

Interface:

```ts
type Infer<T extends Schema> = ReturnType<T['filter']>;
```

Usage:

```ts
import {number, object, string} from 'skex';
import type {Infer} from 'skex';

const schema = object ({ foo: string (), bar: number ().optional () });

type Schema = Infer<typeof schema>; // type Schema = { foo: string, bar?: number }
```

#### `Schema`

This type matches the general shape of a schema node.

Interface:

```ts
type Schema<T = unknown> = {
  filter ( value: unknown ): T,
  get (): Record<string, unknown>,
  test ( value: unknown ): value is T,
  traverse ( traverser: ( child: Schema, parent?: Schema, key?: string | number ) => void ): void
};
```

Usage:

```ts
import type {Schema} from 'skex';

const matchSchema = <T> ( schema: Schema<T>, value: unknown ): value is T => {

  return schema.test ( value );

};
```

## Examples

Some example usages of the library.

#### JSON schema

This schema matches any valid JSON value.

```ts
import * as $ from 'skex';

const primitive = $.or ([ $.boolean (), $.null (), $.number (), $.string () ]);
const json = $.or ([ primitive, $.array ( () => json ), $.record ( () => json ) ]);

json.test ( '...' );
```

#### Extract defaults

This code extracts default values out of a schema. It makes some assumptions, it may need to be tweaked for your use case.

```ts
const toDefaults = schema => {
  const defaults = {};
  const values = new Map ();
  schema.traverse ( ( child, parent, key ) => {
    const valueChild = child.get ( 'default' ) || ( parent ? {} : defaults );
    values.set ( child, valueChild );
    const valueParent = values.get ( parent );
    if ( !valueParent || !key ) return;
    valueParent[key] = valueChild;
  });
  return defaults;
};

const defaults = toDefault ( schema2 );
// {
//   editor: {
//     autosave: {
//       enabled: true,
//       interval: 60000
//     },
//     cursor: {
//       animated: false,
//       blinking: 'blink',
//       style: 'line'
//     }
//   }
// }
```

#### Extract defaults

This code extracts descriptions values out of a schema. It makes some assumptions, it may need to be tweaked for your use case.

```ts
const toDescriptions = schema => {
  const descriptions = {};
  const values = new Map ();
  schema.traverse ( ( child, parent, key ) => {
    const valueChild = child.get ( 'description' ) || ( parent ? {} : descriptions );
    values.set ( child, valueChild );
    const valueParent = values.get ( parent );
    if ( !valueParent || !key ) return;
    valueParent[key] = valueChild;
  });
  return descriptions;
};

const descriptions = toDescriptions ( schema2 );
// {
//   editor: {
//     autosave: {
//       enabled: 'Whether autosaving is enabled or not',
//       interval: 'The mount of time to wait between autosaves'
//     },
//     cursor: {
//       animated: 'Whether the cursor should move smoothly between positions or not',
//       blinking: 'The style used for blinking cursors',
//       style: 'The style used for rendering cursors'
//     }
//   }
// }
```

## License

MIT © Fabio Spampinato
