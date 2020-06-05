const db = require('../lib/db');
const { formatList } = require('../lib/formatter');

const projects = module.exports;

projects.list = async (userId, filters = {}) => {
  const result = await db.projects.findMany({
    where: {
      organization: {
        organizationUsers: {
          some: {
            userId,
          }
        },
        id: filters.org || undefined,
      },
    },
    include: {
      organization: true,
    }
  });

  return formatList(result);
};

projects.create = async (name, creatorId, organizationId) => {
  organizationId = Number(organizationId);

  return db.projects.create({
    data: {
      name,
      creator: {
        connect: {
          id: creatorId,
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
