const express = require('express');
const router = express.Router();
const AsyncAPIParser = require('@asyncapi/parser');

module.exports = router;

router.post('/', async (req, res) => {
  let parsed;
  try {
    parsed = await AsyncAPIParser.parse(req.body)
  } catch (e) {
    return res.status(422).header('Content-Type', 'application/json').send(e);
  }

  try {
    res.json(parsed.json());
  } catch (e) {
    console.error(e);
    return res.status(422).json(e);
  }
});
