(()=>{var e={};e.id=931,e.ids=[931],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1017:e=>{"use strict";e.exports=require("path")},7310:e=>{"use strict";e.exports=require("url")},9858:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>a.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>d,routeModule:()=>h,tree:()=>l});var r=s(6427),n=s(7953),i=s(5145),a=s.n(i),o=s(5288),c={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(c[e]=()=>o[e]);s.d(t,c);let m=r.AppPageRouteModule,l=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,8794)),"/Users/tihom4537/Desktop/asyncApi/studio/apps/studio-next/src/app/page.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,154))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(s.bind(s,8066)),"/Users/tihom4537/Desktop/asyncApi/studio/apps/studio-next/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,1726,23)),"next/dist/client/components/not-found-error"],metadata:{icon:[async e=>(await Promise.resolve().then(s.bind(s,154))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],d=["/Users/tihom4537/Desktop/asyncApi/studio/apps/studio-next/src/app/page.tsx"],p="/page",u={require:s,loadChunk:()=>Promise.resolve()},h=new m({definition:{kind:n.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},9503:(e,t,s)=>{Promise.resolve().then(s.bind(s,5867))},5867:(e,t,s)=>{"use strict";s.r(t),s.d(t,{Editor:()=>y});var r=s(2395),n=s(1679);let i=`
asyncapi: 3.0.0
info:
  title: Streetlights Kafka API
  version: 1.0.0
  description: |-
    The Smartylighting Streetlights API allows you to remotely manage the city
    lights.
    ### Check out its awesome features:

    * Turn a specific streetlight on/off 🌃  
    * Dim a specific streetlight 😎
    * Receive real-time information about environmental lighting conditions 📈
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0
defaultContentType: application/json
servers:
  scram-connections:
    host: test.mykafkacluster.org:18092
    protocol: kafka-secure
    description: Test broker secured with scramSha256
    security:
      - $ref: '#/components/securitySchemes/saslScram'
    tags:
      - name: env:test-scram
        description: >-
          This environment is meant for running internal tests through
          scramSha256
      - name: kind:remote
        description: This server is a remote server. Not exposed by the application
      - name: visibility:private
        description: This resource is private and only available to certain users
  mtls-connections:
    host: test.mykafkacluster.org:28092
    protocol: kafka-secure
    description: Test broker secured with X509
    security:
      - $ref: '#/components/securitySchemes/certs'
    tags:
      - name: env:test-mtls
        description: This environment is meant for running internal tests through mtls
      - name: kind:remote
        description: This server is a remote server. Not exposed by the application
      - name: visibility:private
        description: This resource is private and only available to certain users
channels:
  lightingMeasured:
    address: smartylighting.streetlights.1.0.event.{streetlightId}.lighting.measured
    messages:
      lightMeasured:
        $ref: '#/components/messages/lightMeasured'
    description: The topic on which measured values may be produced and consumed.
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightTurnOn:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.on
    messages:
      turnOn:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightTurnOff:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.turn.off
    messages:
      turnOff:
        $ref: '#/components/messages/turnOnOff'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
  lightsDim:
    address: smartylighting.streetlights.1.0.action.{streetlightId}.dim
    messages:
      dimLight:
        $ref: '#/components/messages/dimLight'
    parameters:
      streetlightId:
        $ref: '#/components/parameters/streetlightId'
operations:
  receiveLightMeasurement:
    action: receive
    channel:
      $ref: '#/channels/lightingMeasured'
    summary: >-
      Inform about environmental lighting conditions of a particular
      streetlight.
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightingMeasured/messages/lightMeasured'
  turnOn:
    action: send
    channel:
      $ref: '#/channels/lightTurnOn'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightTurnOn/messages/turnOn'
  turnOff:
    action: send
    channel:
      $ref: '#/channels/lightTurnOff'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightTurnOff/messages/turnOff'
  dimLight:
    action: send
    channel:
      $ref: '#/channels/lightsDim'
    traits:
      - $ref: '#/components/operationTraits/kafka'
    messages:
      - $ref: '#/channels/lightsDim/messages/dimLight'
components:
  messages:
    lightMeasured:
      name: lightMeasured
      title: Light measured
      summary: >-
        Inform about environmental lighting conditions of a particular
        streetlight.
      contentType: application/json
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/lightMeasuredPayload'
    turnOnOff:
      name: turnOnOff
      title: Turn on/off
      summary: Command a particular streetlight to turn the lights on or off.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/turnOnOffPayload'
    dimLight:
      name: dimLight
      title: Dim light
      summary: Command a particular streetlight to dim the lights.
      traits:
        - $ref: '#/components/messageTraits/commonHeaders'
      payload:
        $ref: '#/components/schemas/dimLightPayload'
  schemas:
    lightMeasuredPayload:
      type: object
      properties:
        lumens:
          type: integer
          minimum: 0
          description: Light intensity measured in lumens.
        sentAt:
          $ref: '#/components/schemas/sentAt'
    turnOnOffPayload:
      type: object
      properties:
        command:
          type: string
          enum:
            - 'on'
            - 'off'
          description: Whether to turn on or off the light.
        sentAt:
          $ref: '#/components/schemas/sentAt'
    dimLightPayload:
      type: object
      properties:
        percentage:
          type: integer
          description: Percentage to which the light should be dimmed to.
          minimum: 0
          maximum: 100
        sentAt:
          $ref: '#/components/schemas/sentAt'
    sentAt:
      type: string
      format: date-time
      description: Date and time when the message was sent.
  securitySchemes:
    saslScram:
      type: scramSha256
      description: Provide your username and password for SASL/SCRAM authentication
    certs:
      type: X509
      description: Download the certificate files from service provider
  parameters:
    streetlightId:
      description: The ID of the streetlight.
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
          clientId:
            type: string
            enum:
              - my-app-id
`,a=(0,n.Ue)(e=>({files:{asyncapi:{uri:"asyncapi",name:"asyncapi",content:i,from:"storage",source:void 0,language:"{"===i.trimStart()[0]?"json":"yaml",modified:!1,stat:{mtime:new Date().getTime()}}},updateFile(t,s){e(e=>({files:{...e.files,[String(t)]:{...e.files[String(t)]||{},...s}}}))}}));var o=s(8136),c=s(3819),m=s(4799),l=s(8726),d=s(2231),p=s(6321),u=s(9207),h=s(4266),g=s(2893);let f=e=>{let{language:t,value:s,onChange:n,autoFocus:i,className:a}=e,f=(0,l.useRef)(null),y=(0,l.useRef)();return(0,l.useEffect)(()=>{let e;if(window&&n(e=localStorage.getItem("document")||s),f.current){let s=o.tk.theme({"&":{backgroundColor:"#252f3f",color:"#fff"},"&.cm-editor":{height:"100%",width:"100%"},"&.cm-focused":{backgroundColor:"#1f2a37"}}),r=m.yy.create({doc:e,extensions:[c.Xy,s,o.$f.of([g.oc]),d.pD,(0,h.nF)(d.VE),"json"===t?(0,p.AV)():(0,u.r)(),o.tk.updateListener.of(e=>(e.docChanged&&(n(e.state.doc.toString()),void 0!==window&&localStorage.setItem("document",e.state.doc.toString())),!1))]});return y.current=new o.tk({parent:f.current,state:r}),i&&y.current.focus(),()=>{y.current?.destroy()}}},[t]),r.jsx("div",{ref:f,className:`${a} flex-grow relative overflow-auto`})},y=e=>{let{language:t,content:s}=a(e=>e.files.asyncapi),n=a(e=>e.updateFile);return r.jsx("div",{className:"flex flex-1 overflow-hidden",children:r.jsx(f,{language:t,value:s,onChange:e=>n("asyncapi",{content:e})})})}},8794:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var r=s(3326),n=s(6962);let i=(0,n.createProxy)(String.raw`/Users/tihom4537/Desktop/asyncApi/studio/apps/studio-next/src/components/Editor/Editor.tsx`),{__esModule:a,$$typeof:o}=i;i.default;let c=i.Editor;function m(){return r.jsx("main",{className:"flex flex-col w-full h-screen",children:r.jsx(c,{})})}},154:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>n});var r=s(226);let n=e=>{let t=(0,r.fillMetadataSegment)(".",e.params,"favicon.ico");return[{type:"image/x-icon",sizes:"48x48",url:t+""}]}}};var t=require("../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[219,461,566],()=>s(9858));module.exports=r})();