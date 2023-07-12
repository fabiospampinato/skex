
/* MAIN - STATE */

type AbstractState<T> = {};

type AndState<T, U> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  options: Schema<U>[]
};

type AnyState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>
};

type ArrayState<T, U> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  items?: FunctionMaybe<Schema<U>>,
  max?: FunctionMaybe<number>,
  min?: FunctionMaybe<number>
};

type BigIntState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  gt?: FunctionMaybe<bigint>,
  gte?: FunctionMaybe<bigint>,
  lt?: FunctionMaybe<bigint>,
  lte?: FunctionMaybe<bigint>,
  multipleOf?: FunctionMaybe<bigint>
};

type BooleanState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>
};

type NullState<T> = AbstractState<T>;

type NullableState<T, U> = AbstractState<T> & {
  nullable: Schema<U>
};

type NumberState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  gt?: FunctionMaybe<number>,
  gte?: FunctionMaybe<number>,
  lt?: FunctionMaybe<number>,
  lte?: FunctionMaybe<number>,
  multipleOf?: FunctionMaybe<number>
};

type ObjectState<T, U> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  properties?: FunctionMaybe<Record<string, Schema<U>>>
};

type OptionalState<T, U> = AbstractState<T> & {
  optional: Schema<U>
};

type OrState<T, U> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  options: Schema<U>[]
};

type StringState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  matches?: RegExp,
  max?: FunctionMaybe<number>,
  min?: FunctionMaybe<number>
};

type SymbolState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>
};

type TupleState<T, U> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>,
  items?: FunctionMaybe<Schema<U>[]>,
  length?: FunctionMaybe<number>
};

type UndefinedState<T> = AbstractState<T>;

type UnknownState<T> = AbstractState<T> & {
  anyOf?: FunctionMaybe<T[]>,
  noneOf?: FunctionMaybe<T[]>
};

/* MAIN - SERIALIZATION */

//TODO

/* MAIN - GENERALS */

type FunctionMaybe<T> = T | (() => T);

type Infer<T extends Schema> = ReturnType<T['filter']>;

type Schema<T = unknown> = {
  filter ( value: unknown ): T,
  test ( value: unknown ): value is T
};

type States<State extends {}> = {
  [K in keyof State]: State[K][]
};

type Tests<BaseType extends unknown, State extends {}> = {
  [K in keyof State]: ( value: BaseType, stateValue: NonNullable<State[K]> ) => boolean
};

/* EXPORT */

export type {AbstractState, AndState, AnyState, ArrayState, BigIntState, BooleanState, NullState, NullableState, NumberState, ObjectState, OrState, OptionalState, StringState, SymbolState, TupleState, UndefinedState, UnknownState};
export type {FunctionMaybe, Infer, Schema, States, Tests};
