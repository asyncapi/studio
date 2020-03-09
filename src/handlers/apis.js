const asyncapi = require('asyncapi-parser');
const db = require('../lib/db');

const apis = module.exports;

apis.list = async (userId) => {
  const result = await db.query(
    'SELECT a.*, o.name as org_name FROM apis a INNER JOIN projects p ON a.project_id = p.id OR a.project_id = NULL LEFT JOIN organizations_users ou ON p.organization_id = ou.organization_id LEFT JOIN organizations o ON o.id = p.organization_id WHERE ou.user_id = $1 OR p.creator_id = $1',
    [userId]
  );

  return result.rows;
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

  return result.rows[0];
};

apis.get = async (id, userId) => {
  const result = await db.query(
    'SELECT a.*, o.name as org_name, o.id as org_id, p.name as project_name FROM apis a INNER JOIN projects p ON a.project_id = p.id OR a.project_id = NULL LEFT JOIN organizations_users ou ON p.organization_id = ou.organization_id LEFT JOIN organizations o ON o.id = p.organization_id WHERE (ou.user_id = $1 OR p.creator_id = $1) AND a.id = $2',
    [userId, id]
  );

  return result.rows[0];
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

    fields.push('asyncapi');
    values.push(asyncapiString);

    fields.push('computed_asyncapi');
    values.push(doc.json());
  }

  const result = await db.query(
    `UPDATE apis SET ${fields.map((f, i) => `${f} = $${i + 1}`).join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};
