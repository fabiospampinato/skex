
/* IMPORT */

import Tuple from '../nodes/tuple';
import type {Infer, Schema} from '../types';

/* MAIN */

function tuple (): Tuple<[]>;
function tuple <S0 extends Schema> ( items: [S0] ): Tuple<[Infer<S0>]>;
function tuple <S0 extends Schema, S1 extends Schema> ( items: [S0, S1] ): Tuple<[Infer<S0>, Infer<S1>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema> ( items: [S0, S1, S2] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema> ( items: [S0, S1, S2, S3] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema> ( items: [S0, S1, S2, S3, S4] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema> ( items: [S0, S1, S2, S3, S4, S5] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema> ( items: [S0, S1, S2, S3, S4, S5, S6] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema> ( items: [S0, S1, S2, S3, S4, S5, S6, S7] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>, Infer<S7>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema> ( items: [S0, S1, S2, S3, S4, S5, S6, S7, S8] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>, Infer<S7>, Infer<S8>]>;
function tuple <S0 extends Schema, S1 extends Schema, S2 extends Schema, S3 extends Schema, S4 extends Schema, S5 extends Schema, S6 extends Schema, S7 extends Schema, S8 extends Schema, S9 extends Schema> ( items: [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9] ): Tuple<[Infer<S0>, Infer<S1>, Infer<S2>, Infer<S3>, Infer<S4>, Infer<S5>, Infer<S6>, Infer<S7>, Infer<S8>, Infer<S9>]>;
function tuple ( items?: Schema[] ): Tuple<unknown[]> {

  return items ? new Tuple ({ items: [items] }) : new Tuple ({ items: [] });

}

/* EXPORT */

export default tuple;
