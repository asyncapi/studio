export default function (url, options) {
  return new Promise((resolve, reject) => {
    options.headers = options.headers || {}
    options.headers.Accept = 'application/json'

    fetch(url, options)
      .catch((err) => {
        console.error(err)
        reject(err)
      })
      .then(async (res) => {
        const json = await res.json()
        if (res.ok) return resolve(json)
        reject(handleError(json))
      })
  })
}

function handleError(json) {
  const baseProblemUrl = `${window.location.origin}/api/problems/`
  let type

  if (json.type && json.type.startsWith(baseProblemUrl)) {
    type = json.type.substr(baseProblemUrl.length)
  }

  switch (type) {
    case 'not-logged-in':
      window.location = '/auth/signin'
      break
  }

  return json
}
