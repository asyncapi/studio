export default async function (asyncapiString) {
  let parse

  if (typeof window === 'undefined') {
    parse = require('asyncapi-parser').parse
  } else {
    require('asyncapi-parser/dist/bundle')
    parse = window.AsyncAPIParser.parse
  }

  return parse(asyncapiString, {
    resolve: {
      file: false,
    },
    dereference: {
      circular: 'ignore',
    }
  })
}
