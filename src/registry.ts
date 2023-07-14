
/* IMPORT */

import {exit} from './utils';
import type {RegistrySchemas} from './types';

/* MAIN */

class Registry {

  /* VARIABLES */

  private schemas: Partial<RegistrySchemas> = {};

  /* API */

  get <T extends keyof RegistrySchemas> ( id: T ): RegistrySchemas[T] {

    const schema = this.schemas[id];

    if ( !schema ) return exit ( `Missing schema: "${id}"` );

    return schema;

  }

  has <T extends keyof RegistrySchemas> ( id: T ): boolean {

    return !!this.schemas[id];

  }

  register <T extends keyof RegistrySchemas> ( id: T, schema: RegistrySchemas[T] ): RegistrySchemas[T] {

    if ( this.has ( id ) ) return exit ( `Duplicate schema: "${id}"` );

    this.schemas[id] = schema;

    return schema;

  }

}

/* EXPORT */

export default new Registry ();
