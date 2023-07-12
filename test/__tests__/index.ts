
/* IMPORT */

import {assert} from 'fava';
import {any, array, boolean, nil, number, object, string} from '..';
import * as Fixtures from './fixtures';

/* HELPERS */

const validateDefaults = ( schema: any, target: any ) => assert.deepEqual ( schema.toDefaults (), target );
const validate = ( schema: any, target: any, result: any ) => assert.deepEqual ( schema.validate ( target ), result );
const filter = ( schema: any, target: any, result: any ) => assert.deepEqual ( schema.filter ( target ), result );

/* MAIN */

const test = () => {

  console.time ( 'benchmark' );

  /* BASE */

  validate ( Fixtures.schema, Fixtures.defaults, true );
  validate ( Fixtures.schema, Fixtures.schema.toDefaults (), true );
  validateDefaults ( Fixtures.schema, Fixtures.defaults );

  /* OBJECT */

  console.timeEnd ( 'benchmark' );
  console.groupCollapsed ( `Passed - ${Date.now ()}` );
  console.groupEnd ();

};

/* EXPORT */

export default test;
