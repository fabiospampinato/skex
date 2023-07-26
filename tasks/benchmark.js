
/* IMPORT */

import {cloneDeep} from 'duper';
import {array, number, object, string} from '../dist/index.js';

/* MAIN */

const schema =  array (
  object ({
    foo: string (),
    arr: array ( number () ).optional ()
  })
);

const target = [
  { foo: 'local' },
  { foo: 'local', arr: ['1', '2', '3'] }
];

const clones = [];

for ( let i = 0; i < 100_000; i++ ) {

  clones.push ( cloneDeep ( target ) );

}

console.time ( 'test' );

for ( let i = 0; i < 100_000; i++ ) {

  schema.test ( clones[i] );

}

console.timeEnd ( 'test' );

console.time ( 'filter' );

for ( let i = 0; i < 100_000; i++ ) {

  schema.filter ( clones[i] );

}

console.timeEnd ( 'filter' );

console.time ( 'test' );

for ( let i = 0; i < 100_000; i++ ) {

  schema.test ( clones[i] );

}

console.timeEnd ( 'test' );
