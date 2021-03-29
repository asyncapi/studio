const express = require('express');
const AsyncAPIParser = require('@asyncapi/parser');

const config = require('../lib/config');
const router = express.Router();

module.exports = router;

router.post('/parse', async (req, res) => {
  let parsed;

  const parserOptions = {
    path: `${config.file_server.protocol}://${config.file_server.hostname}:${config.file_server.port}`,
    resolve: {
      file: false,
      http: {
        headers: {
          Cookie: req.header('Cookie'),
        },
        withCredentials: true,
      },
    },
    dereference: {
      circular: 'ignore',
    }
  };

  try {
    parsed = await AsyncAPIParser.parse(req.body, parserOptions);
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
