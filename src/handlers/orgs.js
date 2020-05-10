const db = require('../lib/db');
const { formatList, formatRow } = require('../lib/formatter');

const orgs = module.exports;

orgs.list = async (userId) => {
  const result = await db.organizations.findMany({
    where: {
      OR: [{
        creatorId: userId,
      }, {
        organizationUsers: {
          some: {
            userId,
          }
        },
      }]
    },
    include: {
      organizationUsers: true,
      plan: true,
    },
  });

  return formatList(result);
};

orgs.get = async (id, userId) => {
  const result = await db.organizations.findMany({
    where: {
      OR: [{
        creatorId: userId,
        id,
      }, {
        id,
        organizationUsers: {
          some: {
            userId,
          }
        },
      }]
    },
    include: {
      organizationUsers: true,
      plan: true,
    },
  });

  return formatRow(result[0]);
};

orgs.getForUser = async (userId, id) => {
  if (id) {
    const result = await db.organizations.findOne({
      where: {
        OR: [{
          creatorId: userId,
          id,
        }, {
          id,
          organizationUsers: {
            some: {
              userId,
            }
          },
        }]
      },
      include: {
        plan: true,
      },
    });

    return formatRow(result);
  }

  const result = await db.organizations.findMany({
    where: {
      OR: [{
        creatorId: userId,
      }, {
        organizationUsers: {
          some: {
            userId,
          }
        },
      }]
    },
    include: {
      plan: true,
    },
  });

  return formatList(result);
};

orgs.create = async (name, creatorId) => {
  const result = await db.organizations.create({
    data: {
      name,
      organizationUsers: {
        create: {
          role: 'admin',
          users: {
            connect: {
              id: creatorId,
            },
          }
        },
      },
      users: {
        connect: {
          id: creatorId,
        }
      }
    },
    include: {
      plan: true,
    }
  });

  return formatRow(result);
};

orgs.patch = async (id, data, userId) => {
  return db.organizations.update({
    where: {
      id,
      organizationUsers: {
        some: {
          userId,
        }
      },
    },
    data,
    include: {
      plan: true,
    },
  });
};

orgs.findUser = async (userId, organizationId) => {
  return db.organizationsUsers.findOne({
    where: {
      userId,
      organizationId,
    },
  });
};

orgs.addUser = async (userId, organizationId, role) => {
  role = role.toLowerCase();

  return db.organizationsUsers.upsert({
    where: {
      userId,
      organizationId,
    },
    create: {
      userId,
      organizationId,
      role,
    },
    update: {
      role,
    }
  });
};

orgs.listUsers = async (organizationId) => {
  organizationId = Number(organizationId);

  const result = await db.users.findMany({
    where: {
      organizationsForUser: {
        some: {
          organizationId,
        }
      }
    },
    include: {
      organizationsForUser: {
        where: {
          organizationId,
        },
      },
      plan: true,
    },
  });

  return formatList(result);
};

orgs.makeUserAdmin = async (organizationId, userId) => {
  return db.organizationsUsers.update({
    where: {
      organizationId,
      userId,
    },
    data: {
      role: 'admin',
    },
  });
};

orgs.makeUserMember = async (organizationId, userId) => {
  return db.organizationsUsers.update({
    where: {
      organizationId,
      userId,
    },
    data: {
      role: 'member',
    },
  });
};

orgs.removeUser = async (organizationId, userId) => {
  return db.organizationsUsers.delete({
    where: {
      organizationId,
      userId,
    },
  });
};
