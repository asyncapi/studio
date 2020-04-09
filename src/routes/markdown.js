const os = require('os');
const fs = require('fs');
const util = require('util');
const path = require('path');
const express = require('express');
const router = express.Router();
const AsyncAPIGenerator = require('@asyncapi/generator');
const archiver = require('archiver');

const readFile = util.promisify(fs.readFile);

module.exports = router;

router.post('/generate', async (req, res) => {
  try {
    const generator = new AsyncAPIGenerator('@asyncapi/markdown-template', os.tmpdir(), {
      entrypoint: 'asyncapi.md',
      output: 'string',
      forceWrite: true,
    });
    const md = await generator.generateFromString(req.body, req.header('x-asyncapi-base-url') || null);

    res.send(md);
  } catch (e) {
    console.error(e);
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e.errors) ? e.errors : null
    });
  }
});

router.get('/template/', async (req, res) => {
  try {
    const content = await readFile(path.resolve(__dirname, '../views/markdown.html'));

    res.header('Content-Type', 'text/html').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.get('/template/css/codemirror/*', async (req, res) => {
  const filename = req.params[0];

  try {
    const content = await readFile(path.resolve(__dirname, '../../node_modules/codemirror', filename));

    res.header('Content-Type', 'text/css').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.get('/template/js/codemirror/*', async (req, res) => {
  const filename = req.params[0];

  try {
    const content = await readFile(path.resolve(__dirname, '../../node_modules/codemirror', filename));

    res.header('Content-Type', 'application/javascript').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.post('/download', async (req, res, next) => {
  try {
    const archive = archiver('zip');
    res.attachment('asyncapi.zip');
    archive.pipe(res);

    archive.append(req.body.data, { name: 'asyncapi.yml' });

    const generator = new AsyncAPIGenerator('@asyncapi/markdown-template', os.tmpdir(), {
      entrypoint: 'asyncapi.md',
      output: 'string',
      forceWrite: true,
    });
    const markdown = await generator.generateFromString(req.body.data);
    archive.append(markdown, { name: 'asyncapi.md' });
    archive.finalize();
  } catch (e) {
    console.error(e);
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e) ? e : null
    });
  }
});
