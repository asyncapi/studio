const db = require('../lib/db');
const organizations = require('./orgs');

const invitations = module.exports = {};

const formatInvitation = (invitation) => {
  if (invitation.organization_id) {
    invitation.organizationId = Number(invitation.organization_id);
    delete invitation.organization_id;
  }
  if (invitation.inviter_id) {
    invitation.inviterId = Number(invitation.inviter_id);
    delete invitation.inviter_id;
  }
  if (invitation.expires_at) {
    invitation.expiresAt = String(invitation.expires_at);
    delete invitation.expires_at;
  }
  if (invitation.created_at) {
    invitation.createdAt = String(invitation.created_at);
    delete invitation.created_at;
  }
  return invitation;
}

const formatInvitations = (list) => {
  if (Array.isArray(list)) return list.map(formatInvitation);
  return list;
}

invitations.get = async (id) => {
  const results = await db.query(
    'SELECT * FROM invitations WHERE id = $1',
    [id]
  );

  return results.rows[0];
};

invitations.create = async (uuid, organizationId, role, scope, expiration, inviterId) => {
  if (!['admin', 'member'].includes(role.toLowerCase())) {
    throw new Error(`Organization role must be either 'admin' or 'member'.`);
  }

  if (!['one', 'multiple', undefined].includes(scope.toLowerCase())) {
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

  const result = await db.query(
    'INSERT INTO invitations (uuid, inviter_id, organization_id, expires_at, role, scope) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [uuid, inviterId, organizationId, expiresAt, role.toLowerCase(), scope]
  );

  return formatInvitation(result.rows[0]);
};

invitations.list = async (organizationId) => {
  const results = await db.query(
    'SELECT * FROM invitations WHERE organization_id = $1 AND expires_at >= NOW() ORDER BY created_at DESC',
    [organizationId]
  );

  return formatInvitations(results.rows);
};

invitations.listForUser = async (email, status = 'pending') => {
  const results = await db.query(
    'SELECT *, o.name AS organization_name, i.id AS invitation_id, i.email AS invitation_email FROM invitations i INNER JOIN users u ON i.inviter_id = u.id INNER JOIN organizations o ON i.organization_id = o.id WHERE i.email = $1 AND i.status = $2 ORDER BY i.created_at DESC',
    [email, status]
  );

  return results.rows;
};

invitations.accept = async (id, user) => {
  const invitation = await invitations.get(id);

  await db.query(
    'UPDATE invitations SET status = $1 WHERE id = $2 AND email = $3',
    ['accepted', id, user.email]
  );

  await organizations.addUser(user, invitation.organization_id, invitation.role);
};

invitations.decline = async (id, user) => {
  await db.query(
    'UPDATE invitations SET status = $1 WHERE id = $2 AND email = $3',
    ['declined', id, user.email]
  );
};

invitations.remove = async (id) => {
  await db.query(
    'DELETE FROM invitations WHERE id = $1',
    [id]
  );
};
