const db = require('../lib/db');
const users = require('./users');

const orgs = module.exports;

orgs.list = async (userId) => {
  const result = await db.query(
    'SELECT * FROM organizations_users ou LEFT JOIN organizations o ON ou.organization_id = o.id WHERE ou.user_id = $1',
    [userId]
  );

  return result.rows;
};

orgs.get = async (id) => {
  const result = await db.query(
    'SELECT * FROM organizations WHERE id = $1',
    [id]
  );

  return result.rows[0];
};

orgs.getForUser = async (userId, orgId) => {
  let result;

  if (orgId) {
    result = await db.query(
      'SELECT * FROM organizations o INNER JOIN organizations_users ou ON o.id = ou.organization_id WHERE o.id = $1 AND ou.user_id = $2',
      [orgId, userId]
    );
  } else {
    result = await db.query(
      'SELECT * FROM organizations o INNER JOIN organizations_users ou ON o.id = ou.organization_id WHERE ou.user_id = $1',
      [userId]
    );
  }

  return result.rows[0];
};

orgs.CreateError = class CreateError extends Error {
  constructor(errs) {
    super();
    this.errs = errs;
  }
}

orgs.create = async (name, slug, creatorId) => {
  const result = await db.query(
    `INSERT INTO organizations (name, slug) VALUES ($1, $2) ON CONFLICT ON CONSTRAINT organizations_slug DO NOTHING RETURNING *`,
    [name, `${slug}-${Buffer.from(String(creatorId), 'utf8').toString('hex')}`]
  );

  await orgs.addUser(creatorId, result.rows[0].id, 'admin');

  return result.rows[0];
};

orgs.patch = async (id, changedFields) => {
  const updateValues = Object.values(changedFields);
  const updateString = Object.keys(changedFields).map((k, i) => `${k}=$${i + 1}`).join(',');

  const result = await db.query(
    `UPDATE organizations SET ${updateString} WHERE id = $${updateValues.length + 1} RETURNING *`,
    [...updateValues, id]
  );

  return result.rows[0];
};

orgs.findUserByEmail = async (email, organizationId) => {
  const user = await users.findByEmail(email);
  if (!user) return;

  const result = await db.query(
    'SELECT * FROM organizations_users WHERE organization_id = $1 AND user_id = $2',
    [organizationId, user.id]
  );

  if (result.rows.length) return user;
};

orgs.addUser = async (userId, organizationId, role) => {
  await db.query(
    'INSERT INTO organizations_users (organization_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT organizations_users_organization_id_user_id DO UPDATE SET role = organizations_users.role',
    [organizationId, userId, role.toLowerCase()]
  );
};

orgs.listUsers = async (organizationId) => {
  const result = await db.query(
    'SELECT *, ou.created_at AS joined_organization_at FROM organizations_users ou INNER JOIN users u ON ou.user_id = u.id WHERE ou.organization_id = $1 ORDER BY ou.role, u.display_name ASC',
    [organizationId]
  );

  return result.rows;
};

orgs.makeUserAdmin = async (organizationId, userId) => {
  await db.query(
    'UPDATE organizations_users SET role = $1 WHERE organization_id = $2 AND user_id = $3',
    ['admin', Number(organizationId), Number(userId)]
  );
};

orgs.makeUserMember = async (organizationId, userId) => {
  await db.query(
    'UPDATE organizations_users SET role = $1 WHERE organization_id = $2 AND user_id = $3',
    ['member', Number(organizationId), Number(userId)]
  );
};

orgs.removeUser = async (organizationId, userId) => {
  await db.query(
    'DELETE FROM organizations_users WHERE organization_id = $1 AND user_id = $2',
    [Number(organizationId), Number(userId)]
  );
};
