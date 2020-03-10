import { useState, useEffect } from 'react'
import EditorLayout from '../components/EditorLayout'
import Editor from '../components/Editor'
import Preview from '../components/Preview'
import EditorToolbar from '../components/EditorToolbar'

export default function Index ({ initialAPI, projects }) {
  if (!initialAPI) initialAPI = getSampleAPI()
  let initCode = initialAPI.asyncapi

  const [api, setAPI] = useState(initialAPI)
  const [code, setCode] = useState(initCode)
  const [initialCode, setInitialCode] = useState(initCode)
  const [saved, setSaved] = useState(true)

  const updateSaved = async () => {
    saveToLocalStorage(api, code)
    setSaved(api.anonymous ? true : api.asyncapi === code)
  }

  const onCodeChange = (editor, data, value) => {
    setCode(value)
  }

  const onImport = (e) => {
    setAPI({
      anonymous: true,
      title: e.url,
      asyncapi: e.content,
    })
    setInitialCode(e.content)
  }

  const onSave = (api) => {
    setAPI({
      ...initialAPI,
      ...api,
    })
    setInitialCode(api.asyncapi)
  }

  useEffect(() => {
    updateSaved()
  }, [initialCode, code])

  return (
    <EditorLayout>
      <EditorToolbar
        api={api}
        code={code}
        saved={saved}
        onSave={onSave}
        projects={projects}
        onImport={onImport}
      />
      <div className="flex flex-row flex-1 overflow-auto">
        <div className="flex flex-1 flex-col max-w-1/2">
          <Editor initialCode={initialCode} onCodeChange={onCodeChange} />
        </div>
        <div className="flex flex-1 flex-col max-w-1/2">
          <Preview code={code} />
        </div>
      </div>
    </EditorLayout>
  )
}


export async function getServerSideProps({ req }) {
  const { list: listProjects } = require('../handlers/projects')
  const projects = await listProjects(req.userPublicInfo.id)

  if (!req.userPublicInfo || !req.query.api) {
    return {
      props: {
        projects,
      }
    }
  }

  const { get: getAPI } = require('../handlers/apis')
  const initialAPI = await getAPI(Number(req.query.api), req.userPublicInfo.id)

  return {
    props: {
      initialAPI,
      projects,
    },
  }
}

const saveToLocalStorage = async (api, code) => {
  try {
    if (typeof localStorage !== 'undefined' && (api.anonymous || api.asyncapi !== code)) {
      localStorage.setItem('asyncapi-document', code)
      const doc = await parseAsyncAPI(code)
      localStorage.setItem('asyncapi-parsed-document', JSON.stringify(doc.json()))
    }
  } catch (e) {
    console.error('Could not store result in localStorage.')
    console.error(e)
  }
}

const parseAsyncAPI = async (asyncapiString) => {
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

const getSampleAPI = () => {
  const api = {
    title: 'Streetlights API',
    asyncapi: getSampleAsyncAPI(),
    anonymous: true,
  }

  try {
    if (typeof localStorage !== 'undefined') {
      api.asyncapi = localStorage.getItem('asyncapi-document')
      const computedAsyncapi = JSON.parse(localStorage.getItem('asyncapi-parsed-document') || '{}')
      api.title = computedAsyncapi && computedAsyncapi.info && computedAsyncapi.info.title ? computedAsyncapi.info.title : 'Untitled document'
      api.title += ' (from local storage)'
    }
  } catch (e) {
    console.error('Could not read previous document from localStorage.')
  }

  return api
}

function getSampleAsyncAPI () {
  return `asyncapi: 2.0.0
info:
  title: Streetlights API
  version: '1.0.0'
  description: |
    The Smartylighting Streetlights API allows you to remotely manage the city lights.

    ### Check out its awesome features:

    * Turn a specific streetlight on/off 🌃
    * Dim a specific streetlight 😎
    * Receive real-time information about environmental lighting conditions 📈
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0

servers:
  production:
    url: api.streetlights.smartylighting.com:{port}
    protocol: mqtt
    description: Test broker
    variables:
      port:
        description: Secure connection (TLS) is available through port 8883.
        default: '1883'
        enum:
          - '1883'
          - '8883'
    security:
      - apiKey: []
      - supportedOauthFlows:
        - streetlights:on
        - streetlights:off
        - streetlights:dim
      - openIdConnectWellKnown: []

defaultContentType: application/json

channels:
  smartylighting/streetlights/1/0/event/{streetlightId}/lighting/measured:
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    subscribe:
      summary: Receive information about environmental lighting conditions of a particular streetlight.
      operationId: receiveLightMeasurement
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/lightMeasured'

  smartylighting/streetlights/1/0/action/{streetlightId}/turn/on:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    publish:
      operationId: turnOn
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/turnOnOff'

  smartylighting/streetlights/1/0/action/{streetlightId}/turn/off:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    publish:
      operationId: turnOff
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/turnOnOff'

  smartylighting/streetlights/1/0/action/{streetlightId}/dim:
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
    publish:
      operationId: dimLight
      traits:
        - $ref: '#/components/operationTraits/kafka'
      message:
        $ref: '#/components/messages/dimLight'

components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: Inform about environmental lighting conditions for a particular streetlight.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/lightMeasuredPayload"
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn the lights on or off.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/turnOnOffPayload"
    dimLight:
      name: dimLight
      title: Dim light
      summary: Command a particular streetlight to dim the lights.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: "#/components/schemas/dimLightPayload"

  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: "#/components/schemas/sentAt"
    turnOnOffPayload:
      type: object
      properties:
        command:
          type: string
          enum:
            - on
            - off
          description: Whether to turn on or off the light.
        sentAt:
          $ref: "#/components/schemas/sentAt"
    dimLightPayload:
      type: object
      properties:
        percentage:
          type: integer
          description: Percentage to which the light should be dimmed to.
          minimum: 0
          maximum: 100
        sentAt:
          $ref: "#/components/schemas/sentAt"
    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.

  securitySchemes:
    apiKey:
      type: apiKey
      in: user
      description: Provide your API key as the user and leave the password empty.
    supportedOauthFlows:
      type: oauth2
      description: Flows to support OAuth 2.0
      flows:
        implicit:
          authorizationUrl: 'https://authserver.example/auth'
          scopes:
            'streetlights:on': Ability to switch lights on
            'streetlights:off': Ability to switch lights off
            'streetlights:dim': Ability to dim the lights
        password:
          tokenUrl: 'https://authserver.example/token'
          scopes:
            'streetlights:on': Ability to switch lights on
            'streetlights:off': Ability to switch lights off
            'streetlights:dim': Ability to dim the lights
        clientCredentials:
          tokenUrl: 'https://authserver.example/token'
          scopes:
            'streetlights:on': Ability to switch lights on
            'streetlights:off': Ability to switch lights off
            'streetlights:dim': Ability to dim the lights
        authorizationCode:
          authorizationUrl: 'https://authserver.example/auth'
          tokenUrl: 'https://authserver.example/token'
          refreshUrl: 'https://authserver.example/refresh'
          scopes:
            'streetlights:on': Ability to switch lights on
            'streetlights:off': Ability to switch lights off
            'streetlights:dim': Ability to dim the lights
    openIdConnectWellKnown:
      type: openIdConnect
      openIdConnectUrl: 'https://authserver.example/.well-known'

  parameters:
    streetlightId:
      description: The ID of the streetlight.
      schema:
        type: string

  messageTraits:
    commonHeaders:
      headers:
        type: object
        properties:
          my-app-header:
            type: integer
            minimum: 0
            maximum: 100

  operationTraits:
    kafka:
      bindings:
        kafka:
          clientId: my-app-id`
}
