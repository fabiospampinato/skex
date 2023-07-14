
/* IMPORT */

import Registry from './registry';
import {exit, isBigInt, isFunction, isObject, isSchema, isString, isSymbol} from './utils';
import type {Schema} from './types';

/* MAIN */

const Serializer = {

  /* API */

  deserialize: <T> ( schema: string ): Schema<T> => {

    return JSON.parse ( schema, ( key, value ) => {

      if ( isObject ( value ) ) {

        if ( isString ( value['$$schema'] ) && isObject ( value['$$state'] ) ) {

          const Schema = Registry.get ( value['$$schema'] );

          return new Schema ( value['$$state'] );

        }

        if ( isString ( value['$$type'] ) && isString ( value['$$value'] ) ) {

          if ( value['$$type'] === 'bigint' ) {

            return BigInt ( value['$$value'] );

          }

        }

      }

      return value;

    });

  },

  serialize: <T> ( schema: Schema<T> ): string => {

    const data = {
      $$schema: Registry.getId ( schema.constructor ),
      $$state: schema.get ()
    };

    return JSON.stringify ( data, ( key, value ) => {

      if ( isSchema ( value ) ) {

        return {
          $$schema: Registry.getId ( value.constructor ),
          $$state: value.get ()
        };

      }

      if ( isBigInt ( value ) ) {

        return {
          $$type: 'bigint',
          $$value: value.toString ()
        };

      }

      if ( isFunction ( value ) || isSymbol ( value ) ) {

        exit ( `Unserializable value: ${value}` );

      }

      return value;

    });

  }

};

/* EXPORT */

export default Serializer;
