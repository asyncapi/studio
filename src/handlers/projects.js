const db = require('../lib/db');

const projects = module.exports;

projects.list = async (userId) => {
  const result = await db.query(
    'SELECT p.*, o.name as org_name FROM projects p LEFT JOIN organizations_users ou ON p.organization_id = ou.organization_id LEFT JOIN organizations o ON o.id = p.organization_id WHERE ou.user_id = $1',
    [userId]
  );

  return result.rows;
};

projects.create = async (name, creatorId, organizationId) => {
  const result = await db.query(
    'INSERT INTO projects (name, creator_id, organization_id) VALUES ($1, $2, $3) RETURNING *',
    [name, creatorId, organizationId]
  );

  return result.rows;
};
