
/* MAIN - REGISTRY */

type RegistrySchemas = {
  and: typeof import ( './nodes/and' ).default,
  any: typeof import ( './nodes/any' ).default,
  array: typeof import ( './nodes/array' ).default,
  bigint: typeof import ( './nodes/bigint' ).default,
  boolean: typeof import ( './nodes/boolean' ).default,
  nillable: typeof import ( './nodes/nillable' ).default,
  null: typeof import ( './nodes/null' ).default,
  nullable: typeof import ( './nodes/nullable' ).default,
  number: typeof import ( './nodes/number' ).default,
  object: typeof import ( './nodes/object' ).default,
  optional: typeof import ( './nodes/optional' ).default,
  or: typeof import ( './nodes/or' ).default,
  record: typeof import ( './nodes/record' ).default,
  string: typeof import ( './nodes/string' ).default,
  symbol: typeof import ( './nodes/symbol' ).default,
  tuple: typeof import ( './nodes/tuple' ).default,
  undefined: typeof import ( './nodes/undefined' ).default,
  unknown: typeof import ( './nodes/unknown' ).default
};

/* MAIN - STATE */

type AbstractState<BaseType, FullType> = {
  default?: FullType,
  description?: string
};

type AndState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  options: Schema<U>[]
};

type AnyState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>
};

type ArrayState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  items?: FunctionMaybe<Schema<U>>,
  max?: FunctionMaybe<number>,
  min?: FunctionMaybe<number>
};

type BigIntState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  gt?: FunctionMaybe<bigint>,
  gte?: FunctionMaybe<bigint>,
  lt?: FunctionMaybe<bigint>,
  lte?: FunctionMaybe<bigint>,
  multipleOf?: FunctionMaybe<bigint>
};

type BooleanState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>
};

type NillableState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  nillable: Schema<U>
};

type NullState<BaseType, FullType> = AbstractState<BaseType, FullType>;

type NullableState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  nullable: Schema<U>
};

type NumberState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  gt?: FunctionMaybe<number>,
  gte?: FunctionMaybe<number>,
  lt?: FunctionMaybe<number>,
  lte?: FunctionMaybe<number>,
  multipleOf?: FunctionMaybe<number>
};

type ObjectState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  properties?: FunctionMaybe<Record<string, Schema<U>>>
};

type OptionalState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  optional: Schema<U>
};

type OrState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  options: Schema<U>[]
};

type RecordState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  keys?: FunctionMaybe<Schema<string>>,
  values?: FunctionMaybe<Schema<U>>
};

type StringState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  matches?: (( value: string ) => boolean) | RegExp,
  max?: FunctionMaybe<number>,
  min?: FunctionMaybe<number>
};

type SymbolState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>
};

type TupleState<BaseType, FullType, U> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>,
  items?: FunctionMaybe<Schema<U>[]>,
  length?: FunctionMaybe<number>
};

type UndefinedState<BaseType, FullType> = AbstractState<BaseType, FullType>;

type UnknownState<BaseType, FullType> = AbstractState<BaseType, FullType> & {
  anyOf?: FunctionMaybe<BaseType[]>,
  noneOf?: FunctionMaybe<BaseType[]>
};

/* MAIN - GENERALS */

type FunctionMaybe<T> = T | (() => T);

type Infer<T extends Schema> = ReturnType<T['filter']>;

type Schema<T = unknown> = {
  filter ( value: unknown, defaultable?: boolean ): T,
  get (): Record<string, unknown>,
  test ( value: unknown ): value is T,
  traverse ( traverser: Traverser, parent?: Schema, property?: string | number ): void
};

type Tests<BaseType extends unknown, State extends {}> = {
  [K in keyof State]: ( value: BaseType, stateValue: NonNullable<State[K]> ) => boolean
};

type Traverser = ( child: Schema, parent?: Schema, key?: string | number ) => void;

/* EXPORT */

export type {RegistrySchemas};
export type {AbstractState, AndState, AnyState, ArrayState, BigIntState, BooleanState, NillableState, NullState, NullableState, NumberState, ObjectState, OrState, OptionalState, RecordState, StringState, SymbolState, TupleState, UndefinedState, UnknownState};
export type {FunctionMaybe, Infer, Schema, Tests, Traverser};
