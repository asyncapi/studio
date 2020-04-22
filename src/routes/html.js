const os = require('os');
const fs = require('fs');
const util = require('util');
const path = require('path');
const express = require('express');
const router = express.Router();
const AsyncAPIGenerator = require('@asyncapi/generator');
const AsyncAPIParser = require('@asyncapi/parser');
const archiver = require('archiver');
const config = require('../lib/config');

const readFile = util.promisify(fs.readFile);

module.exports = router;

router.post('/generate', async (req, res) => {
  let parsed

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
    parsed = await AsyncAPIParser.parse(req.body, parserOptions)
  } catch (e) {
    return res.status(422).header('Content-Type', 'application/json').send(e);
  }

  try {
    const generator = new AsyncAPIGenerator('@asyncapi/html-template', os.tmpdir(), {
      entrypoint: 'index.html',
      output: 'string',
      forceWrite: true,
    });
    const html = await generator.generateFromString(req.body, parserOptions);

    res.json({
      html,
      parsedJSON: parsed.json(),
    });
  } catch (e) {
    console.error(e);
    return res.status(422).json(e);
  }
});

router.get('/template/', async (req, res) => {
  try {
    const content = await readFile(path.resolve(__dirname, '../views/html.html'));

    res.header('Content-Type', 'text/html').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.get('/template/css/*', async (req, res) => {
  const filename = req.params[0];

  try {
    const content = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', `css/${filename}`, path.resolve(__dirname, '../../node_modules'));

    res.header('Content-Type', 'text/css').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.get('/template/js/*', async (req, res) => {
  const filename = req.params[0];

  try {
    const content = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', `js/${filename}`, path.resolve(__dirname, '../../node_modules'));

    res.header('Content-Type', 'application/javascript').send(content);
  } catch (e) {
    console.error(e);
    return res.status(404).send();
  }
});

router.post('/download', async (req, res, next) => {
  let archive;

  try {
    archive = archiver('zip');
    res.attachment('asyncapi.zip');
    archive.pipe(res);

    archive.append(req.body.data, { name: 'asyncapi.yml' });

    const generator = new AsyncAPIGenerator('@asyncapi/html-template', os.tmpdir(), {
      entrypoint: 'index.html',
      output: 'string',
      forceWrite: true,
    });
    const html = await generator.generateFromString(req.body.data);
    archive.append(html, { name: 'index.html' });
  } catch (e) {
    console.error(e);
    return res.status(422).send({
      code: 'incorrect-format',
      message: e.message,
      errors: Array.isArray(e) ? e : null
    });
  }

  try {
    const css = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', 'css/tailwind.min.css', path.resolve(__dirname, '../../node_modules'));
    archive.append(css, { name: 'css/tailwind.min.css' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const css = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', 'css/atom-one-dark.min.css', path.resolve(__dirname, '../../node_modules'));
    archive.append(css, { name: 'css/atom-one-dark.min.css' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const css = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', 'css/main.css', path.resolve(__dirname, '../../node_modules'));
    archive.append(css, { name: 'css/main.css' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const js = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', 'js/highlight.min.js', path.resolve(__dirname, '../../node_modules'));
    archive.append(js, { name: 'js/highlight.min.js' });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }

  try {
    const js = await AsyncAPIGenerator.getTemplateFile('@asyncapi/html-template/template', 'js/main.js', path.resolve(__dirname, '../../node_modules'));
    archive.append(js, { name: 'js/main.js' });

    archive.finalize();
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      code: 'server-error',
      message: e.message,
      errors: e
    });
  }
});
