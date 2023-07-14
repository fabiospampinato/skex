# Skex

A modern schema validation and filtration library with great TypeScript support.

## Install

```sh
npm install --save skex
```

## APIs

| [Primitive Ops](#primitive-ops) | [Compound Ops](#compound-ops) | [Types Ops](#types-ops) | [Utilities](#utilities)   | [Types](#types)     |
| ------------------------------- | ----------------------------- | ----------------------- | ----------------------------- | ------------------- |
| [`bigint`](#bigint)             | [`array`](#array)             | [`any`](#any)           | [`serialize`](#serialize)     | [`Infer`](#infer)   |
| [`boolean`](#boolean)           | [`tuple`](#tuple)             | [`unknown`](#unknown)   | [`deserialize`](#deserialize) | [`Schema`](#schema) |
| [`null`](#null)                 | [`object`](#object)           |                         |                               |                     |
| [`number`](#number)             | [`record`](#record)           |                         |                               |                     |
| [`string`](#string)             | [`nillable`](#nillable)       |                         |                               |                     |
| [`symbol`](#symbol)             | [`nullable`](#nullable)       |                         |                               |                     |
| [`undefined`](#undefined)       | [`optional`](#optional)       |                         |                               |                     |
|                                 | [`and`](#and)                 |                         |                               |                     |
|                                 | [`or`](#or)                   |                         |                               |                     |

## Usage

## Primitive Ops

#### `bigint`

This op matches a single [BigInt](https://developer.mozilla.org/en-US/docs/Glossary/BigInt) value.

```ts
import {bigint} from 'skex';

bigint ();

bigint ().gt ( 0n );
bigint ().gte ( 0n );
bigint ().min ( 0n );
bigint ().lt ( 0n );
bigint ().lte ( 0n );
bigint ().max ( 0n );
bigint ().multipleOf ( 0n );

bigint ().anyOf ([ 1n, 2n, 3n ]);
bigint ().noneOf ([ 1n, 2n, 3n ]);
bigint ().nillable ();
bigint ().nullable ();
bigint ().optional ();
```

#### `boolean`

This op matches a single [Boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean) value.

```ts
import {boolean} from 'skex';

boolean ();

boolean ().anyOf ([ true ]);
boolean ().noneOf ([ true ]);
boolean ().nillable ();
boolean ().nullable ();
boolean ().optional ();
```

#### `null`

This op matches a single [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) value.

```ts
import {null} from 'skex';

null ();
null ().optional ();
```

#### `number`

This op matches a single [Number](https://developer.mozilla.org/en-US/docs/Glossary/Number) value.

```ts
import {number} from 'skex';

number ();

number ().gt ( 0 );
number ().gte ( 0 );
number ().min ( 0 );
number ().lt ( 0 );
number ().lte ( 0 );
number ().max ( 0 );
number ().multipleOf ( 0 );

number ().anyOf ([ 1, 2, 3 ]);
number ().noneOf ([ 1, 2, 3 ]);
number ().nillable ();
number ().nullable ();
number ().optional ();
```

#### `string`

This op matches a single [String](https://developer.mozilla.org/en-US/docs/Glossary/String) value.

```ts
import {string} from 'skex';

string ();

string ().length ( 3 );
string ().min ( 3 );
string ().max ( 3 );
string ().matches () //TODO: RegExp and Function

string ().anyOf ([ 'a', 'b', 'c' ]);
string ().noneOf ([ 'a', 'b', 'c' ]);
string ().nillable ();
string ().nullable ();
string ().optional ();
```

#### `symbol`

This op matches a single [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) value.

```ts
import {symbol} from 'skex';

symbol ();

symbol ().anyOf ([ Symbol.iterator, Symbol.asyncIterator ]);
symbol ().noneOf ([ Symbol.iterator, Symbol.asyncIterator ]);
symbol ().nillable ();
symbol ().nullable ();
symbol ().optional ();
```

#### `undefined`

This op matches a single [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined) value.

```ts
import {undefined} from 'skex';

undefined ();
undefined ().nullable ();
```

## Compound Ops

#### `array`

This op matches a single [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) value, optionally matching all of its items against another schema.

```ts
import {array} from 'skex';

array ();
array ( number () );

array ().length ( 3 );
array ().min ( 3 );
array ().max ( 3 );
array ().items ( number () );

array ().anyOf ([ [1, 2], ['a', 'b'] ]);
array ().noneOf ([ [1, 2], ['a', 'b'] ]);
array ().nillable ();
array ().nullable ();
array ().optional ();
```

#### `tuple`

This op matches a single [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) value, but where the exact type and index of each item in the array is explicit.

```ts
import {tuple} from 'skex';

tuple ();
tuple ([ number (), string (), boolean () ]);

tuple ().length ( 3 );
tuple ().min ( 3 );
tuple ().max ( 3 );
tuple ().items ( number () );

tuple ().anyOf ([ [1, 2], ['a', 'b'] ]);
tuple ().noneOf ([ [1, 2], ['a', 'b'] ]);
tuple ().nillable ();
tuple ().nullable ();
tuple ().optional ();
```

#### `object`

This op matches a single [Plain Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) value, optionally matching each property with a specific schema.

```ts
import {object} from 'skex';

object ();
object ({ foo: number ().optional (), bar: string ().optional () });
object ().properties ( number () );

object ().anyOf ([ { foo: 123 }, { bar: 'abc' } ]);
object ().noneOf ([ { foo: 123 }, { bar: 'abc' } ]);
object ().nillable ();
object ().nullable ();
object ().optional ();
```

#### `record`

This op matches a single [Plain Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) value, there all values, and optoinally all keys also, are matches against a specific schema.

```ts
import {record} from 'skex';

record ();
record ( number () );
record ( string ().min ( 3 ), number () );

record ().anyOf ([ { foo: 123 }, { bar: 'abc' } ]);
record ().noneOf ([ { foo: 123 }, { bar: 'abc' } ]);
record ().nillable ();
record ().nullable ();
record ().optional ();
```

#### `nillable`

This op accepts [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined) or [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) additionally to the type matched by the provided schema.

```ts
import {nillable} from 'skex';

nillable ( number () );
```

#### `nullable`

This op accepts [Null](https://developer.mozilla.org/en-US/docs/Glossary/Null) additionally to the type matched by the provided schema.

```ts
import {nullable} from 'skex';

nullable ( number () );
```

#### `optional`

This op accepts [Undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined) additionally to the type matched by the provided schema.

```ts
import {optional} from 'skex';

optional ( number () );
```

#### `and`

This op matches multiple schemas on the same value at the same time.

```ts
import {and} from 'skex';

and ([ string ().matches ( /aaa/ ), string ().matches ( /bbb/ ) ]);
and ([ object ({ foo: number () }), object ({ bar: string () }) ]);

and ().anyOf ();
and ().noneOf ();
and ().nillable ();
and ().nullable ();
and ().optional ();
```

#### `or`

This op matches at least one of the provided schemas on the provided value.

```ts
import {or} from 'skex';

or ([ string (), number () ]);

or ().anyOf ();
or ().noneOf ();
or ().nillable ();
or ().nullable ();
or ().optional ();
```

## Types Ops

#### `any`

This op matches any value, and it asserts it's value to be of type `any`.

```ts
import {any} from 'skex';

any ();

any ().anyOf ();
any ().noneOf ();
```

#### `unknown`

This op matches any value, and it asserts it's value to be of type `unknown`.

```ts
import {unknown} from 'skex';

unknown ();

unknown ().anyOf ();
unknown ().noneOf ();
```

## Utilities

#### `serialize`

This utility serializes an arbitrary schema to a string.

Any schema can be serialized to a string, unless they reference symbols or functions.

```ts
import {number, serialize} from 'skex';

serialize ( number ().min ( 3 ) );
```

#### `deserialize`

This utility deserializes a serialized schema back to its usable form.

Any serialized schema can be deserialized, unless you are using custom schema ops, for now.

```ts
import {number, deserialize} from 'skex';

const serialized = serialize ( number ().min ( 3 ) );
const deserialized = deserialize ( serialized );
```

## Types

#### Infer

This type allows you to extract the type that any schema matches.

```ts
import {object} from 'skex';
import type {Infer} from 'skex';

const schema = object ({ foo: string (), bar: number ().optional () });

type Schema = Infer<typeof schema>;
```

#### Schema

This type matches the general shape of a schema.

```ts
import type {Schema} from 'skex';

const matchSchema = <T> ( schema: Schema<T>, value: unknown ): value is T => {
  return schema.test ( value );
};
```

## Examples

Some example usages.

#### JSON schema

This schema matches any valid JSON value.

```ts
```

#### Extract defaults

This code extracts default values out of a schema.

```ts
```

#### Extract defaults

This code extracts descriptions values out of a schema.

```ts
```

## License

MIT © Fabio Spampinato
