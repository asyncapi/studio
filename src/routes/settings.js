const router = require('express').Router();
const { patch } = require('../handlers/users');

module.exports = router;

router.post('/profile', async (req, res, next) => {
  try {
    const { displayName, company } = req.body;
    const profile = await patch(req.user.id, { displayName, company });
    const user = req.user;
    user.displayName = profile.displayName;
    user.company = profile.company;
    res.redirect('/settings/profile');
  } catch (e) {
    next(e);
  }
});
