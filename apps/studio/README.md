[![AsyncAPI Studio](../../assets/logo.png)](https://studio.asyncapi.com)

One place that allows you to develop an AsyncAPI document, validate it, convert it to the latest version, preview the documentation and visualize the events flow.

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

---

## :loudspeaker: ATTENTION:

This project is still under development and has not reached version 1.0.0 yet. This means that its API/styling/features may contain breaking changes until we're able to deploy the first stable version and begin semantic versioning.

---

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Requirements](#requirements)
- [Using it locally](#using-it-locally)
- [Using it via Docker](#using-it-via-docker)
- [Development](#development)
  * [Spin up Gitpod](#spin-up-gitpod)
- [Contribution](#contribution)
- [Contributors ✨](#contributors-%E2%9C%A8)

<!-- tocstop -->

## Requirements

- [NodeJS](https://nodejs.org/en/) >= 14

## Using it locally

Run:

```bash
npm install
npm start
```

and then go to [http://localhost:3000](http://localhost:3000).

## Using it via Docker

Run:

```bash
docker run -it -p 8000:80 asyncapi/studio
```

and then go to [http://localhost:8000](http://localhost:8000).

The `asyncapi/studio` image is based on the official `nginx` image.
Please refer to the [Nginx documentation](https://registry.hub.docker.com/_/nginx/) to learn how to e.g. pass a custom `nginx` configuration or plug in additional volumes.

In some hosting scenarios (e.g. Docker Compose, Kubernetes) the container might not be exposed at the root path of the host.
Set the environment variable `BASE_URL` to let AsyncAPI Studio know from where to resolve static assets:

```bash
docker run -it -p 8000:80 -e BASE_URL=/a/custom/path asyncapi/studio
```

Studio is also available as a Docker Desktop Extension. For more information, check [the related repository](https://github.com/thiyagu06/asyncapi-studio-docker-extension).

## Development

1. Setup project by installing dependencies `npm install`
2. Write code and tests.
3. Make sure all tests pass `npm test`

### Spin up Gitpod 
In order to prepare and spin up a Gitpod dev environment for our project, we configured our workspace through a [.gitpod.yml](/.gitpod.yml) file.

To spin up a Gitpod, go to http://gitpod.io/#https://github.com/asyncapi/studio.

## Contribution

Read [CONTRIBUTING](https://github.com/asyncapi/.github/blob/master/CONTRIBUTING.md) guide.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/magicmatatjahu"><img src="https://avatars.githubusercontent.com/u/20404945?v=4?s=100" width="100px;" alt="Maciej Urbańczyk"/><br /><sub><b>Maciej Urbańczyk</b></sub></a><br /><a href="#maintenance-magicmatatjahu" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/studio/commits?author=magicmatatjahu" title="Code">💻</a> <a href="https://github.com/asyncapi/studio/commits?author=magicmatatjahu" title="Documentation">📖</a> <a href="https://github.com/asyncapi/studio/issues?q=author%3Amagicmatatjahu" title="Bug reports">🐛</a> <a href="#ideas-magicmatatjahu" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/studio/pulls?q=is%3Apr+reviewed-by%3Amagicmatatjahu" title="Reviewed Pull Requests">👀</a> <a href="#design-magicmatatjahu" title="Design">🎨</a> <a href="https://github.com/asyncapi/studio/commits?author=magicmatatjahu" title="Tests">⚠️</a> <a href="#infra-magicmatatjahu" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#mentoring-magicmatatjahu" title="Mentoring">🧑‍🏫</a></td>
      <td align="center"><a href="http://www.fmvilas.com/"><img src="https://avatars.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt="Fran Méndez"/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="#maintenance-fmvilas" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/studio/commits?author=fmvilas" title="Code">💻</a> <a href="https://github.com/asyncapi/studio/commits?author=fmvilas" title="Documentation">📖</a> <a href="https://github.com/asyncapi/studio/issues?q=author%3Afmvilas" title="Bug reports">🐛</a> <a href="#ideas-fmvilas" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/studio/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a> <a href="#design-fmvilas" title="Design">🎨</a> <a href="https://github.com/asyncapi/studio/commits?author=fmvilas" title="Tests">⚠️</a> <a href="#infra-fmvilas" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#mentoring-fmvilas" title="Mentoring">🧑‍🏫</a></td>
      <td align="center"><a href="https://boyney.io/"><img src="https://avatars.githubusercontent.com/u/3268013?v=4?s=100" width="100px;" alt="David Boyne"/><br /><sub><b>David Boyne</b></sub></a><br /><a href="#maintenance-boyney123" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/studio/commits?author=boyney123" title="Code">💻</a> <a href="https://github.com/asyncapi/studio/commits?author=boyney123" title="Documentation">📖</a> <a href="https://github.com/asyncapi/studio/issues?q=author%3Aboyney123" title="Bug reports">🐛</a> <a href="#ideas-boyney123" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/studio/pulls?q=is%3Apr+reviewed-by%3Aboyney123" title="Reviewed Pull Requests">👀</a> <a href="#design-boyney123" title="Design">🎨</a> <a href="https://github.com/asyncapi/studio/commits?author=boyney123" title="Tests">⚠️</a> <a href="#mentoring-boyney123" title="Mentoring">🧑‍🏫</a></td>
      <td align="center"><a href="https://missyturco.com/"><img src="https://avatars.githubusercontent.com/u/60163079?v=4?s=100" width="100px;" alt="Missy Turco"/><br /><sub><b>Missy Turco</b></sub></a><br /><a href="#maintenance-mcturco" title="Maintenance">🚧</a> <a href="https://github.com/asyncapi/studio/commits?author=mcturco" title="Code">💻</a> <a href="#ideas-mcturco" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/studio/pulls?q=is%3Apr+reviewed-by%3Amcturco" title="Reviewed Pull Requests">👀</a> <a href="#design-mcturco" title="Design">🎨</a> <a href="#mentoring-mcturco" title="Mentoring">🧑‍🏫</a></td>
      <td align="center"><a href="https://florian.greinacher.de/"><img src="https://avatars.githubusercontent.com/u/1540469?v=4?s=100" width="100px;" alt="Florian Greinacher"/><br /><sub><b>Florian Greinacher</b></sub></a><br /><a href="https://github.com/asyncapi/studio/commits?author=fgreinacher" title="Code">💻</a> <a href="#infra-fgreinacher" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/studio/issues?q=author%3Afgreinacher" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/studio/commits?author=fgreinacher" title="Documentation">📖</a></td>
      <td align="center"><a href="https://ritik307.github.io/portfolio/"><img src="https://avatars.githubusercontent.com/u/22374829?v=4?s=100" width="100px;" alt="Ritik Rawal"/><br /><sub><b>Ritik Rawal</b></sub></a><br /><a href="https://github.com/asyncapi/studio/commits?author=ritik307" title="Code">💻</a></td>
      <td align="center"><a href="https://samridhi-98.github.io/Portfolio"><img src="https://avatars.githubusercontent.com/u/54466041?v=4?s=100" width="100px;" alt="Samriddhi"/><br /><sub><b>Samriddhi</b></sub></a><br /><a href="https://github.com/asyncapi/studio/commits?author=Samridhi-98" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://paulinenarvas.com/"><img src="https://avatars.githubusercontent.com/u/17087373?v=4?s=100" width="100px;" alt="Pauline P. Narvas"/><br /><sub><b>Pauline P. Narvas</b></sub></a><br /><a href="https://github.com/asyncapi/studio/commits?author=pawlean" title="Code">💻</a> <a href="#infra-pawlean" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/studio/commits?author=pawlean" title="Documentation">📖</a></td>
      <td align="center"><a href="https://linkedin.com/in/jonaslagoni/"><img src="https://avatars.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt="Jonas Lagoni"/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/studio/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a></td>
      <td align="center"><a href="https://github.com/smoya"><img src="https://avatars.githubusercontent.com/u/1083296?v=4?s=100" width="100px;" alt="Sergio Moya"/><br /><sub><b>Sergio Moya</b></sub></a><br /><a href="#ideas-smoya" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-smoya" title="Answering Questions">💬</a></td>
      <td align="center"><a href="https://bolt04.github.io/react-ultimate-resume/"><img src="https://avatars.githubusercontent.com/u/18630253?v=4?s=100" width="100px;" alt="David Pereira"/><br /><sub><b>David Pereira</b></sub></a><br /><a href="#ideas-BOLT04" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-BOLT04" title="Answering Questions">💬</a></td>
      <td align="center"><a href="https://nawedali.tech"><img src="https://avatars.githubusercontent.com/u/83456083?v=4?s=100" width="100px;" alt="Nawed Ali"/><br /><sub><b>Nawed Ali</b></sub></a><br /><a href="https://github.com/asyncapi/studio/commits?author=nawed2611" title="Code">💻</a> <a href="https://github.com/asyncapi/studio/issues?q=author%3Anawed2611" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/aeworxet"><img src="https://avatars.githubusercontent.com/u/16149591?v=4?s=100" width="100px;" alt="Viacheslav Turovskyi"/><br /><sub><b>Viacheslav Turovskyi</b></sub></a><br /><a href="https://github.com/asyncapi/studio/commits?author=aeworxet" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
