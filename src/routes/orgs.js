const router = require('express').Router();
const { list } = require('../handlers/orgs');

module.exports = router;

// router.get('/', async (req, res, next) => {
//   try {
//     const orgList = await list(req.user.id);
//     res.send({ data: orgList });
//   } catch (e) {
//     next(e);
//   }
// });
