const router = require('express').Router();
const { updateProfile } = require('../handlers/user');

module.exports = router;

router.post('/profile', async (req, res, next) => {
  try {
    const { displayName, company } = req.body;
    const profile = await updateProfile(displayName, company, req.user.id);
    const user = req.user;
    user.display_name = profile.display_name;
    user.company = profile.company;
    res.redirect('/profile');
  } catch (e) {
    next(e);
  }
});
