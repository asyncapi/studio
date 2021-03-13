const router = require('express').Router();
const { get: getInvitation, create, remove, accept } = require('../handlers/invitations');
const { get: getOrg } = require('../handlers/orgs');
const buildInvitationUrl = require('../lib/build-invitation-url.js');
const isAuthenticated = require('../middlewares/is-authenticated');
const HubError = require('../error');

module.exports = router;

router.get('/:uuid/accept', async (req, res, next) => {
  try {
    const { uuid } = req.params;
    if (req.isAuthenticated()) {
      const invitation = await getInvitation(uuid, true);
      const org = await getOrg(invitation.organizationId);
      if (!org) {
        throw new HubError({
          type: 'organization-invite-org-not-found',
          title: `Organization not found`,
          detail: `Could not find organization with id ${invitation.organizationId}.`,
          status: 404,
        });
      }

      await accept(uuid, req.user.id);
      res.redirect('/');
    } else {
      req.session.redirectUrl = buildInvitationUrl(uuid);
      res.redirect('/auth/signin');
    }
  } catch (e) {
    next(e);
  }
});

router.post('/', isAuthenticated, async (req, res, next) => {
  const { uuid, orgId, role, scope, expiration } = req.body;

  try {
    const org = await getOrg(orgId, req.user.id);
    if (!org) {
      throw new HubError({
        type: 'organization-invite-org-not-found',
        title: 'Organization not found',
        detail: `Could not find organization with id ${orgId}.`,
        status: 404,
      });
    }

    const invitation = await create(uuid, orgId, role, scope, expiration, req.user.id);
    res.send(invitation);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;
    await remove(id);
    res.send('OK');
  } catch (e) {
    next(e);
  }
});
