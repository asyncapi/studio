const db = require('../lib/db');
const { formatList, formatRow } = require('../lib/formatter');
const HubError = require('../error');

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
  if (userId) {
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
  }

  const result = await db.organizations.findOne({
    where: {
      id,
    },
    include: {
      organizationUsers: true,
      plan: true,
    },
  });

  return formatRow(result);
};

orgs.getForUser = async (userId, id) => {
  if (id) {
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
        plan: true,
      },
    });

    return formatRow(result[0]);
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
  id = Number(id);

  const organization = await db.organizations.findMany({
    where: {
      id,
      organizationUsers: {
        some: {
          userId,
        }
      },
    }
  });

  if (!organization[0]) throw new HubError({
    type: 'organization-not-found',
    title: 'Organization not found',
    detail: `Could not update organization with id ${id}. It doesn't exist or you're not part of it.`,
    status: 422,
  });

  const result = await db.organizations.update({
    where: {
      id,
    },
    data,
    include: {
      plan: true,
    },
  });

  return formatRow(result[0]);
};

orgs.findUser = async (userId, organizationId) => {
  const result = await db.organizationsUsers.findMany({
    where: {
      userId,
      organizationId,
    },
  });

  return result[0];
};

orgs.addUser = async (userId, organizationId, role) => {
  const userInOrg = await orgs.findUser(userId, organizationId);
  if (userInOrg) return userInOrg;

  return db.organizationsUsers.create({
    data: {
      role: role.toLowerCase(),
      user: {
        connect: {
          id: userId,
        },
      },
      organization: {
        connect: {
          id: organizationId,
        },
      },
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
  organizationId = Number(organizationId);
  userId = Number(userId);
  return db.organizationsUsers.updateMany({
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
  organizationId = Number(organizationId);
  userId = Number(userId);
  return db.organizationsUsers.updateMany({
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
