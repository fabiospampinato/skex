
/* IMPORT */

import {exit} from './utils';
import type {RegistrySchemas} from './types';

/* MAIN */

class Registry {

  /* VARIABLES */

  private ids: Map<RegistrySchemas[keyof RegistrySchemas], string> = new Map ();
  private schemas: Partial<RegistrySchemas> = {};

  /* API */

  get <T extends keyof RegistrySchemas> ( id: T ): RegistrySchemas[T] {

    const schema = this.schemas[id];

    if ( !schema ) return exit ( `Missing schema: "${id}"` );

    return schema;

  }

  getId ( schema: RegistrySchemas[keyof RegistrySchemas] ): string {

    const id = this.ids.get ( schema );

    if ( !id ) return exit ( 'Missing schema' );

    return id;

  }

  has <T extends keyof RegistrySchemas> ( id: T ): boolean {

    return !!this.schemas[id];

  }

  register <T extends keyof RegistrySchemas> ( id: T, schema: RegistrySchemas[T] ): RegistrySchemas[T] {

    if ( this.has ( id ) ) return exit ( `Duplicate schema: "${id}"` );

    this.schemas[id] = schema;
    this.ids.set ( schema, id );

    return schema;

  }

}

/* EXPORT */

export default new Registry ();
