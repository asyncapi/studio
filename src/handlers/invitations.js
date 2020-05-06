const db = require('../lib/db');
const organizations = require('./orgs');
const { formatList, formatRow } = require('../lib/formatter');

const invitations = module.exports = {};

invitations.get = async (uuid, onlyActive = false) => {
  const result = await db.invitations.findMany({
    where: {
      uuid,
      expiresAt: onlyActive ? {
        gte: new Date().toISOString(),
      } : undefined,
    }
  });

  return formatRow(result[0]);
};

invitations.create = async (uuid, organizationId, role, scope, expiration, inviterId) => {
  role = role.toLowerCase();
  scope = scope.toLowerCase();

  if (!['admin', 'member'].includes(role)) {
    throw new Error(`Organization role must be either 'admin' or 'member'.`);
  }

  if (!['one', 'multiple', undefined].includes(scope)) {
    throw new Error(`Invitation scope must be either 'one' or 'multiple'.`);
  }

  const expiresAt = new Date();
  if (expiration === '1d') {
    expiresAt.setDate(expiresAt.getDate() + 1);
  } else if (expiration === '1w') {
    expiresAt.setDate(expiresAt.getDate() + 7);
  } else {
    expiresAt.setDate(expiresAt.getDate() + 1);
  }

  const result = await db.invitations.create({
    data: {
      uuid,
      expiresAt,
      role,
      scope,
      inviter: {
        connect: {
          id: inviterId,
        },
      },
      organization: {
        connect: {
          id: organizationId,
        },
      },
    }
  });

  return formatRow(result);
};

invitations.list = async (organizationId) => {
  organizationId = Number(organizationId);

  const result = await db.invitations.findMany({
    where: {
      expiresAt: {
        gte: new Date().toISOString(),
      },
      organizationId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return formatList(result);
};

invitations.accept = async (uuid, userId) => {
  const { id, organizationId, role, scope } = await invitations.get(uuid, true);

  const result = db.organizationsUsers.upsert({
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

  if (scope === 'one') invitations.remove(id);

  return formatRow(result);
};

invitations.remove = async (id) => {
  await db.invitations.delete({
    where: {
      id,
    },
  });
};
