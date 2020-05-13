const db = require('../lib/db');
const { formatRow } = require('../lib/formatter');
const HubError = require('../error');

const users = module.exports = {};

users.findById = async (id) => {
  return formatRow(await db.users.findOne({
    where: {
      id,
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
  }));
};

users.filterUserWithPublicInfo = (user) => {
  return {
    id: user.id,
    displayName: user.displayName,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    company: user.company,
    plan: user.plan,
    organizationsForUser: user.organizationsForUser,
  };
}

users.getUserPublicInfo = async (id) => {
  const user = await users.findById(id);
  return formatRow(users.filterUserWithPublicInfo(user));
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

users.changePlanTo = async (planName, userId) => {
  const userWithOrgs = await db.users.findOne({
    where: {
      id: userId,
    },
    include: {
      organizations: true,
    },
  });

  if (userWithOrgs.organizations.length) {
    const updateStatements = userWithOrgs.organizations.map(org => ({
      data: {
        plan: {
          connect: {
            name: planName,
          },
        },
      },
      where: {
        id: org.id,
      },
    }));

    await db.users.update({
      where: {
        id: userId,
      },
      data: {
        plan: {
          connect: {
            name: planName,
          },
        },
        organizations: {
          update: updateStatements,
        },
      },
    });
  }
};

users.patch = async (id, data) => {
  return db.users.update({
    where: {
      id,
    },
    data,
    include: {
      plan: true,
    },
  });
};


users.savePluginData = async (id, pluginName, data = {}) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    throw new HubError({
      type: 'save-plugin-data-user-not-found',
      title: 'User not found',
      detail: `Could not save plugin (${pluginName}) data because user with id ${id} doesn't exist.`,
      status: 422,
    });
  }

  let existingData = {};

  try {
    existingData = JSON.parse(user.pluginData);
  } catch (e) {
    // We did our best...
  }

  let pluginData = existingData[pluginName];
  if (!pluginData) pluginData = {};

  pluginData = { ...pluginData, ...data };
  existingData[pluginName] = pluginData;
  existingData = JSON.stringify(existingData);

  return formatRow(users.patch(id, { pluginData: existingData }));
};

users.getPluginData = async (id, pluginName) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });

  if (!user) {
    throw new HubError({
      type: 'get-plugin-data-user-not-found',
      title: 'User not found',
      detail: `Could not obtain plugin (${pluginName}) data because user with id ${id} doesn't exist.`,
      status: 422,
    });
  }

  let result = {};

  try {
    const pluginData = JSON.parse(user.pluginData);
    result = pluginData[pluginName] || {};
  } catch (e) {
    throw new HubError({
      type: 'get-plugin-data-invalid-data',
      title: 'Invalid data',
      detail: `Could not parse data for plugin ${pluginName}.`,
      status: 422,
    });
  }

  return formatRow(result);
};
