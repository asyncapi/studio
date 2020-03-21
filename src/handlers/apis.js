const asyncapi = require('asyncapi-parser');
const db = require('../lib/db');

const apis = module.exports;

const formatAPI = (api) => {
  if (api.created_at) api.created_at = String(api.created_at);
  return api;
}

const formatList = (list) => {
  if (Array.isArray(list)) return list.map(formatAPI);
  return list;
}

apis.list = async (userId, filters = {}) => {
  const keys = []
  const values = []

  if (filters.org) {
    keys.push('o.id')
    values.push(Number(filters.org))
  }

  if (filters.project) {
    keys.push('a.project_id')
    values.push(Number(filters.project))
  }

  const where = keys.length ? keys.map((k, i) => ` AND ${k} = $${i + 2}`) : ''
  const result = await db.query(
    `SELECT a.*, o.id as org_id, o.name as org_name, p.id as project_id, p.name as project_name FROM apis a INNER JOIN projects p ON a.project_id = p.id OR a.project_id = NULL LEFT JOIN organizations_users ou ON p.organization_id = ou.organization_id LEFT JOIN organizations o ON o.id = p.organization_id WHERE (ou.user_id = $1 OR p.creator_id = $1)${where}`,
    [userId, ...values]
  );

  return formatList(result.rows);
};

apis.create = async (title, asyncapiString, projectId, creatorId) => {
  asyncapiString = asyncapiString || `asyncapi: 2.0.0
info:
  title: ${title}
  version: 0.1.0
channels: {}`;

  const doc = await asyncapi.parse(asyncapiString, {
    resolve: {
      file: false,
    },
    dereference: {
      circular: 'ignore',
    }
  });

  const computedAsyncapi = doc.json();

  const result = await db.query(
    `INSERT INTO apis (title, asyncapi, computed_asyncapi, version, project_id, creator_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, asyncapiString, computedAsyncapi, doc.info().version(), projectId, creatorId]
  );

  return formatAPI(result.rows[0]);
};

apis.get = async (id, userId) => {
  const result = await db.query(
    'SELECT a.*, o.name as org_name, o.id as org_id, p.name as project_name FROM apis a INNER JOIN projects p ON a.project_id = p.id OR a.project_id = NULL LEFT JOIN organizations_users ou ON p.organization_id = ou.organization_id LEFT JOIN organizations o ON o.id = p.organization_id WHERE (ou.user_id = $1 OR p.creator_id = $1) AND a.id = $2',
    [userId, id]
  );

  return formatAPI(result.rows[0]);
};

apis.patch = async (id, asyncapiString) => {
  const fields = [];
  const values = [];

  if (typeof asyncapiString === 'string') {
    const doc = await asyncapi.parse(asyncapiString, {
      resolve: {
        file: false,
      },
      dereference: {
        circular: 'ignore',
      }
    });

    fields.push('title');
    values.push(doc.info().title());

    fields.push('version');
    values.push(doc.info().version());

    fields.push('asyncapi');
    values.push(asyncapiString);

    fields.push('computed_asyncapi');
    values.push(doc.json());
  }

  const result = await db.query(
    `UPDATE apis SET ${fields.map((f, i) => `${f} = $${i + 1}`).join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return formatAPI(result.rows[0]);
};

apis.remove = async (id, userId) => {
  return db.query(
    'DELETE FROM apis WHERE id = $1 AND creator_id = $2',
    [id, userId]
  );
};
