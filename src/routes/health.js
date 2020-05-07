const router = require('express').Router();
const db = require('../lib/db');

module.exports = router;

router.get('/', async (req, res) => {
  try {
    await db.users.findOne({ where: { id: 1 } });
    res.send('All good!');
  } catch (e) {
    res.status(500).send(e);
  }
});
