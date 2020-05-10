const db = require('../lib/db');

const users = module.exports = {};

users.findById = async (id) => {
  return await db.users.findOne({
    where: {
      id,
    },
    include: {
      plan: true,
    }
  });
};

users.createFromGithub = async ({ displayName, email, username, avatar, company }) => {
  return db.users.upsert({
    where: {
      email,
    },
    create: {
      displayName,
      email,
      username,
      avatar,
      company,
      projects: {
        create: {
          name: 'default',
          organization: {
            create: {
              name: `${displayName}'s org`,
              creator: {
                connect: {
                  email,
                }
              },
              organizationUsers: {
                create: {
                  role: 'admin',
                  user: {
                    connect: {
                      email,
                    }
                  },
                },
              },
            },
          },
        },
      },
    },
    update: {
      displayName,
      email,
      username,
      avatar,
      company,
    },
    include: {
      plan: true,
      organizationsForUser: {
        include: {
          organization: {
            include: {
              plan: true,
            }
          }
        }
      },
    }
  });
};

users.patch = async (id, data) => {
  return db.users.update({
    where: {
      id,
    },
    data,
    include: {
      plan: true,
    }
  });
};
