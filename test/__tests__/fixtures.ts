
/* IMPORT */

import {number, object, boolean, string, array} from '..';

/* MAIN */

const schema = object ({
  editor: object ({
    autosave: object ({
      enabled: boolean ().default ( true ),
      interval: number ().default ( 60000 )
    }),
    indentation: object ({
      guides: object ({
        enabled: boolean ().default ( true )
      })
    }),
    lineNumbers: object ({
      enabled: boolean ().default ( false )
    }),
    minimap: object ({
      enabled: boolean ().default ( false )
    }),
    rulers: object ({
      enabled: boolean ().default ( false ),
      columns: array ( number () ).default ([ 80 ])
    }),
    scrollBeyondLastLine: object ({
      enabled: boolean ().default ( false )
    }),
    wordWrap: object ({
      enabled: boolean ().default ( true )
    }),
    mode: object ({
      split: object ({
        enabled: boolean ().default ( false )
      })
    })
  }),
  katex: object ({
    macros: object ({
      '/.+/': string ()
    }).default ({
      '\\cf': '\\ce'
    })
  }),
  sort: object ({
    dimension: string ().anyOf ([ 'date_created', 'date_modified', 'title' ]).default ( 'title' ),
    order: string ().anyOf ([ 'ascending', 'descending' ]).default ( 'ascending' )
  }),
  tabs: object ({
    alwaysPersistent: boolean ().default ( false )
  }),
  telemetry: object ({
    enabled: boolean ().default ( true ),
    logging: object ({
      enabled: boolean ().default ( false )
    })
  }),
  themes: object ({
    active: string ().default ( 'light' ),
    colors: object ({
      '/^[a-zA-Z0-9:]+$/': string (),
      '/^\\[[a-zA-Z0-9]+\\]$/': object ({
        '/^[a-zA-Z0-9:]+$/': string ()
      })
    }).default ({
      'color:override:here': 'transparent'
    }),
    installed: object ({
      '/.*/': object ({
        id: string ().required (),
        base: string ().anyOf (['dark', 'light']),
        title: string ().required (),
        colors: object ().required ().properties ({
          '/^[a-zA-Z0-9:]+$/': string ()
        })
      })
    })
  }),
  updater: object ({
    download: boolean ().default ( true ),
    interval: number ().default ( 28800 )
  }),
  view: object ({
    middlebar: object ({
      enabled: boolean ().default ( true )
    }),
    sidebar: object ({
      enabled: boolean ().default ( true )
    }),
    statusbar: object ({
      enabled: boolean ().default ( false )
    }),
    zoom: number ().default ( 1 ),
    mode: object ({
      centered: object ({
        enabled: boolean ().default ( false )
      }),
      zen: object ({
        enabled: boolean ().default ( false )
      })
    })
  })
});

const defaults = {
  editor: {
    autosave: {
      enabled: true,
      interval: 60000
    },
    indentation: {
      guides: {
        enabled: true
      }
    },
    lineNumbers: {
      enabled: false
    },
    minimap: {
      enabled: false
    },
    rulers: {
      enabled: false,
      columns: [80]
    },
    scrollBeyondLastLine: {
      enabled: false
    },
    wordWrap: {
      enabled: true
    },
    mode: {
      split: {
        enabled: false
      }
    }
  },
  katex: {
    macros: {
      '\\cf': '\\ce'
    }
  },
  sort: {
    dimension: 'title',
    order: 'ascending'
  },
  tabs: {
    alwaysPersistent: false
  },
  telemetry: {
    enabled: true,
    logging: {
      enabled: false
    }
  },
  themes: {
    active: 'light',
    colors: {
      'color:override:here': 'transparent'
    },
    installed: {}
  },
  updater: {
    download: true,
    interval: 28800
  },
  view: {
    middlebar: {
      enabled: true
    },
    sidebar: {
      enabled: true
    },
    statusbar: {
      enabled: false
    },
    zoom: 1,
    mode: {
      centered: {
        enabled: false
      },
      zen: {
        enabled: false
      }
    }
  }
};

/* EXPORT */

export {schema, defaults};
