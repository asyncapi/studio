const router = require('express').Router();
const slug = require('../lib/slug');
const { create } = require('../handlers/orgs');

module.exports = router;

router.post('/new', async (req, res, next) => {
  try {
    const { name } = req.body;
    const org = await create(name, slug(name), req.user.id);
    res.redirect(`/organizations/${org.slug}`);
  } catch (e) {
    next(e);
  }
});
