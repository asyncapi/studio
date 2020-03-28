const router = require('express').Router();
const { create, remove } = require('../handlers/invitations');

module.exports = router;

router.post('/', async (req, res, next) => {
  try {
    const { uuid, orgId, role, scope, expiration } = req.body;
    const invitation = await create(uuid, orgId, role, scope, expiration, req.user.id);
    res.send(invitation);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await remove(id);
    res.send('OK');
  } catch (e) {
    next(e);
  }
});
