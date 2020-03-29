const router = require('express').Router();
const slug = require('../lib/slug');
const { create, rename, removeUser, makeUserAdmin, makeUserMember } = require('../handlers/orgs');

module.exports = router;

router.post('/new', async (req, res, next) => {
  try {
    const { name } = req.body;
    const org = await create(name, slug(name), req.user.id);
    res.redirect(`/settings/organizations/${org.id}`);
  } catch (e) {
    next(e);
  }
});

router.delete('/:orgId/users/:userId', async (req, res, next) => {
  try {
    const { orgId, userId } = req.params;
    await removeUser(orgId, userId, req.user.id);
    res.send('OK');
  } catch (e) {
    next(e);
  }
});

router.post('/:orgId/users/:userId/makeAdmin', async (req, res, next) => {
  try {
    const { orgId, userId } = req.params;
    await makeUserAdmin(orgId, userId, req.user.id);
    res.send('OK');
  } catch (e) {
    next(e);
  }
});

router.post('/:orgId/users/:userId/makeMember', async (req, res, next) => {
  try {
    const { orgId, userId } = req.params;
    await makeUserMember(orgId, userId, req.user.id);
    res.send('OK');
  } catch (e) {
    next(e);
  }
});

router.patch('/:orgId', async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { name } = req.body;
    const org = await rename(orgId, name);
    res.send(org);
  } catch (e) {
    next(e);
  }
});
