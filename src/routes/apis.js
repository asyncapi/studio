const router = require('express').Router();
const { create, patch, remove } = require('../handlers/apis');

module.exports = router;

router.post('/new', async (req, res, next) => {
  try {
    const { name, project } = req.body;
    const api = await create(name, null, Number(project), req.user.id);
    res.redirect(`/apis/${api.id}`);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, projectId, asyncapi } = req.body;
    const api = await create(title, asyncapi, projectId, req.user.id);
    res.send(api);
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

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await remove(id, req.user.id);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
