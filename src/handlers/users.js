const db = require('../lib/db');
const crypto = require('../lib/crypto');
const orgs = require('./orgs');
const projects = require('./projects');

const users = module.exports = {};

users.findById = async (id) => {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return JSON.parse(JSON.stringify(result.rows[0]));
};

users.findByIdWithOrganization = async (id) => {
  const result = await db.query(
    'SELECT *, u.id AS id, o.name AS organization_name FROM users u INNER JOIN organizations_users ou ON ou.user_id = u.id INNER JOIN organizations o ON o.id = ou.organization_id WHERE u.id = $1 ORDER BY ou.role ASC',
    [id]
  );

  return JSON.parse(JSON.stringify(result.rows[0]));
};

users.findByEmail = async (email) => {
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return JSON.parse(JSON.stringify(result.rows[0]));
};

users.findByEmailWithOrganization = async (email, org_id) => {
  let result;

  if (!org_id) {
    result = await db.query(
      'SELECT *, u.id AS id, o.name AS organization_name FROM users u INNER JOIN organizations_users ou ON ou.user_id = u.id INNER JOIN organizations o ON o.id = ou.organization_id WHERE u.email = $1 ORDER BY ou.role ASC',
      [email]
    );
  } else {
    result = await db.query(
      'SELECT *, u.id AS id, o.name AS organization_name FROM users u INNER JOIN organizations_users ou ON ou.user_id = u.id INNER JOIN organizations o ON o.id = ou.organization_id WHERE u.email = $1 AND ou.organization_id = $2 ORDER BY ou.role ASC',
      [email, org_id]
    );
  }

  return JSON.parse(JSON.stringify(result.rows[0]));
};

users.createFromGithub = async ({ displayName, email, username, avatar, company, githubId, githubAccessToken, githubRefreshToken }) => {
  try {
    await db.query('BEGIN');
    const result = await db.query(
      `INSERT INTO users (display_name, email, username, avatar, company, github_id, github_access_token, github_refresh_token) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [displayName, email, username, avatar, company, githubId, crypto.hashPassword(githubAccessToken), githubRefreshToken ? crypto.hashPassword(githubRefreshToken) : '']
    );

    const org = await orgs.create(`${displayName}'s org`, username, result.rows[0].id);
    await projects.create('default', result.rows[0].id, org.id);
    await db.query('COMMIT');

    return JSON.parse(JSON.stringify(result.rows[0]));
  } catch (e) {
    if (e.constraint === 'users_email') {
      return users.updateFromGithub({ email, githubId, githubAccessToken, githubRefreshToken });
    }

    await db.query('ROLLBACK');
    console.error(e);
    throw e;
  }
};

users.updateFromGithub = async ({ email, githubId, githubAccessToken, githubRefreshToken }) => {
  try {
    const result = await db.query(
      `UPDATE users SET github_id = $1, github_access_token = $2, github_refresh_token = $3 WHERE email = $4 RETURNING *`,
      [githubId, crypto.hashPassword(githubAccessToken), githubRefreshToken ? crypto.hashPassword(githubRefreshToken) : '', email]
    );

    return JSON.parse(JSON.stringify(result.rows[0]));
  } catch (e) {
    console.error(e);
    throw e;
  }
};

users.patch = async (id, changedFields) => {
  if (changedFields.password) changedFields.password = crypto.hashPassword(changedFields.password);

  const updateValues = Object.values(changedFields);
  const updateString = Object.keys(changedFields).map((k, i) => `${k}=$${i + 1}`).join(',');

  const result = await db.query(
    `UPDATE users SET ${updateString} WHERE id = $${updateValues.length + 1} RETURNING *`,
    [...updateValues, id]
  );

  return JSON.parse(JSON.stringify(result.rows[0]));
};
