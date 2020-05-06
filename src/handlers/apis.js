const asyncapi = require('@asyncapi/parser');
const db = require('../lib/db');
const { formatList, formatRow } = require('../lib/formatter');

const apis = module.exports;

const defaultAsyncAPI = (title) => `asyncapi: 2.0.0
info:
  title: '${title}'
  version: 0.1.0

channels:
  example:
    subscribe:
      message:
        headers:
          type: object
          properties:
            myHeader:
              type: integer
        payload:
          type: object
          properties:
            exampleField:
              type: string
`;

apis.list = async (userId, filters = {}) => {
  const result = await db.apis.findMany({
    where: {
      OR: [{
        creatorId: userId,
      }, {
        project: {
          organization: {
            organizationUsers: {
              some: {
                userId,
              }
            },
            id: filters.org,
          },
          id: filters.projectId,
        },
      }]
    },
    include: {
      project: {
        include: {
          organization: true,
        }
      }
    },
  });

  return formatList(result);
};

apis.create = async (title, asyncapiString, projectId, creatorId) => {
  asyncapiString = asyncapiString || defaultAsyncAPI(title);

  const doc = await asyncapi.parse(asyncapiString, {
    resolve: {
      file: false,
    },
    dereference: {
      circular: 'ignore',
    }
  });

  const computedAsyncapi = JSON.stringify(doc.json());

  const result = db.apis.create({
    data: {
      title,
      asyncapi: asyncapiString,
      computedAsyncapi,
      version: doc.info().version(),
      project: {
        connect: {
          id: projectId,
        },
      },
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });

  return formatRow(result);
};

apis.get = async (id, userId) => {
  const result = await db.apis.findMany({
    where: {
      id,
      project: {
        organization: {
          organizationUsers: {
            some: {
              userId,
            }
          }
        }
      }
    },
    include: {
      project: {
        include: {
          organization: true,
        }
      },
    }
  });

  return formatRow(result[0]);
};

apis.patch = async (id, asyncapiString, userId) => {
  id = Number(id);

  const data = {};

  if (typeof asyncapiString === 'string') {
    const doc = await asyncapi.parse(asyncapiString, {
      resolve: {
        file: false,
      },
      dereference: {
        circular: 'ignore',
      }
    });

    data.title = doc.info().title();
    data.version = doc.info().version();
    data.asyncapi = asyncapiString;
    data.computedAsyncapi = JSON.stringify(doc.json());
  }

  await db.apis.updateMany({
    where: {
      id,
      project: {
        organization: {
          organizationUsers: {
            some: {
              userId,
            }
          }
        }
      },
    },
    data,
  });

  const result = await db.apis.findMany({
    where: {
      id,
      project: {
        organization: {
          organizationUsers: {
            some: {
              userId,
            }
          }
        }
      },
    },
    include: {
      project: {
        include: {
          organization: true,
        }
      }
    },
  });

  return formatRow(result[0]);
};

apis.remove = async (id, userId) => {
  id = Number(id);

  return db.apis.deleteMany({
    where: {
      id,
      project: {
        organization: {
          organizationUsers: {
            some: {
              userId,
            }
          }
        }
      },
    },
  });
};
