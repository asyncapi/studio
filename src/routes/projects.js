const router = require('express').Router();
const { create } = require('../handlers/projects');

module.exports = router;

router.post('/new', async (req, res, next) => {
  try {
    const { name, org } = req.body;
    const project = await create(name, req.user.id, org);
    res.redirect(`/directory?project=${project.id}`);
  } catch (e) {
    next(e);
  }
});
