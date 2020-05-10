const router = require('express').Router();
const { list, create, patch, removeUser, makeUserAdmin, makeUserMember, getBySlug } = require('../handlers/orgs');

module.exports = router;

router.post('/new', async (req, res, next) => {
  try {
    const { name } = req.body;
    const org = await create(name, req.user.id);
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
    const { name, slug } = req.body;
    const org = await patch(orgId, {
      name,
      slug,
    }, req.user.id);
    res.send(org);
  } catch (e) {
    next(e);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { slug } = req.query;
    if (slug) {
      const org = await getBySlug(slug);
      if (org) {
        res.send(org)
      } else {
        res.status(404).send();
      }
    } else {
      const orgs = await list(req.user.id);
      res.send(orgs);
    }
  } catch (e) {
    next(e);
  }
});

router.get('/new', (req, res, next) => {
  const plan = req.userPublicInfo.plan || {};
  const restrictions = plan.restrictions || {};
  const maxOrgCount = restrictions['organizations.maxCount'];

  if (
    typeof maxOrgCount === 'number'
    && req.userPublicInfo.organizationsForUser.length >= maxOrgCount
  ) {
    return res.redirect('/upgrade');
  }

  next();
});
