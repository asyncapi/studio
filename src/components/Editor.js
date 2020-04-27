import { useState } from 'react'
import MonacoEditorWrapper from '../components/MonacoEditorWrapper'
import Preview from '../components/Preview'
import EditorToolbar from '../components/EditorToolbar'
import Spinner from '../components/Spinner'

export default function Editor ({ initialAPI, projects }) {
  if (!initialAPI) initialAPI = getSampleAPI()
  const initCode = initialAPI.asyncapi

  const [api, setAPI] = useState(initialAPI)
  const [initialCode, setInitialCode] = useState(initCode)
  const [currentUnsavedCode, setCurrentUnsavedCode] = useState(initialCode)
  const [parsingError, setParsingError] = useState()
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const isSaved = () => {
    return api.anonymous ? true : api.asyncapi === currentUnsavedCode
  }

  const onCodeChange = async (ev, value) => {
    setCurrentUnsavedCode(value)
    setIsLoadingPreview(true)
  }

  const onPreviewContentChange = async (ev) => {
    setParsingError()
    setIsLoadingPreview(false)
    saveToLocalStorage(currentUnsavedCode, ev.parsedJSON)
    if (ev.parsedJSON.info.title !== api.title) {
      setAPI({
        ...api,
        ...{
          title: ev.parsedJSON.info.title,
        },
      })
    }
  }

  const onPreviewError = async (error) => {
    setParsingError(error)
    setIsLoadingPreview(false)
  }

  const onImport = async (e) => {
    setInitialCode(e.content)

    setAPI({
      ...initialAPI,
      ...api,
    })
  }

  const onSave = (api) => {
    setAPI({
      ...initialAPI,
      ...api,
    })
  }

  return (
    <>
      <EditorToolbar
        api={api}
        code={currentUnsavedCode}
        saved={isSaved()}
        onSave={onSave}
        projects={projects}
        onImport={onImport}
      />
      <div className="flex flex-row flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col max-w-1/2">
          {/* <CodeMirrorWrapper code={initialCode} onCodeChange={onCodeChange} /> */}
          <MonacoEditorWrapper
            language="yaml"
            theme="asyncapi-theme"
            onChange={onCodeChange}
            value={initialCode}
            className="bg-black"
            error={parsingError}
            options={{
              minimap: {
                enabled: false,
              },
              wordWrap: 'on',
            }}
          />
        </div>
        <div className="flex flex-1 flex-col max-w-1/2">
          { (isLoadingPreview || parsingError) && (
            <div className="absolute z-50 ml-2 mt-2">
              {parsingError && (
                <div className="mb-8 px-4 py-3 bg-red-500 text-white rounded border border-red-700 shadow-xl">
                  <h3 className="font-bold">Your document contains errors</h3>
                  <p className="text-sm">Check the instructions on the editor.</p>
                </div>
              )}

              {isLoadingPreview && (
                <div className="ml-6 mt-6"><Spinner /></div>
              )}
            </div>
          )}
          <Preview code={currentUnsavedCode} onContentChange={onPreviewContentChange} onError={onPreviewError} />
        </div>
      </div>
    </>
  )
}

const saveToLocalStorage = async (code, parsedJSON) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('asyncapi-document', code)
      localStorage.setItem('asyncapi-parsed-document', JSON.stringify(parsedJSON))
    }
  } catch (e) {
    console.error('Could not store result in localStorage.')
    console.error(e)
  }
}

const getSampleAPI = () => {
  const api = {
    title: 'Streetlights API',
    asyncapi: getSampleAsyncAPI(),
    anonymous: true,
  }

  try {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('asyncapi-document')) {
        api.asyncapi = localStorage.getItem('asyncapi-document')
        const computedAsyncapi = JSON.parse(localStorage.getItem('asyncapi-parsed-document') || '{}')
        api.title = computedAsyncapi && computedAsyncapi.info && computedAsyncapi.info.title ? computedAsyncapi.info.title : 'Untitled document'
        api.fromLocalStorage = true
      }
    }
  } catch (e) {
    console.error('Could not read previous document from localStorage.')
    console.error(e)
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
