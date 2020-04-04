const router = require('express').Router();
const { create, remove, accept } = require('../handlers/invitations');
const buildInvitationUrl = require('../lib/build-invitation-url.js');
const isAuthenticated = require('../middlewares/is-authenticated');

module.exports = router;

router.get('/:uuid/accept', async (req, res, next) => {
  try {
    const { uuid } = req.params;
    if (req.isAuthenticated()) {
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
  try {
    const { uuid, orgId, role, scope, expiration } = req.body;
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
