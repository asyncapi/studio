const router = require('express').Router();
const { list } = require('../handlers/projects');

module.exports = router;

// router.get('/', async (req, res, next) => {
//   try {
//     const projectList = await list();
//     res.send({ data: projectList });
//   } catch (e) {
//     next(e);
//   }
// });
