const router = require('express').Router();
const { create, patch } = require('../handlers/apis');

module.exports = router;

router.post('/new', async (req, res, next) => {
  try {
    const { name, project } = req.body;
    const api = await create(name, null, project, req.user.id);
    res.redirect(`/?api=${api.id}`);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { asyncapi } = req.body;
    const api = await patch(id, asyncapi, req.user.id);
    res.send(api);
  } catch (e) {
    next(e);
  }
});
