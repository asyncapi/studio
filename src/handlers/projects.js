const db = require('../lib/db');

const projects = module.exports;

const formatProject = (api) => {
  if (api.created_at) api.created_at = String(api.created_at);
  return api;
}

const formatList = (list) => {
  if (Array.isArray(list)) return list.map(formatProject);
  return list;
}

projects.list = async (userId, filters = {}) => {
  const keys = []
  const values = []

  if (filters.org) {
    keys.push('o.id')
    values.push(Number(filters.org))
  }

  const where = keys.length ? keys.map((k, i) => ` AND ${k} = $${i + 2}`) : ''
  const result = await db.query(
    `SELECT p.*, o.name as org_name FROM projects p LEFT JOIN organizations_users ou ON p.organization_id = ou.organization_id LEFT JOIN organizations o ON o.id = p.organization_id WHERE ou.user_id = $1${where}`,
    [userId, ...values]
  );

  return formatList(result.rows);
};

projects.create = async (name, creatorId, organizationId) => {
  const result = await db.query(
    'INSERT INTO projects (name, creator_id, organization_id) VALUES ($1, $2, $3) RETURNING *',
    [name, creatorId, organizationId]
  );

  return formatProject(result.rows[0]);
};
