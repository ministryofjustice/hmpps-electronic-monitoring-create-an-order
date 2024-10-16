import * as jose from 'jose'
import { Request } from 'superagent'
import { v4 as uuidv4 } from 'uuid'

import { stubFor, getMatchingRequests } from './wiremock'
import tokenVerification from './tokenVerification'

interface UserToken {
  name?: string
  roles?: string[]
}

const alg = 'RS256'

type KeyPair = {
  publicKey: jose.KeyLike
  privateKey: jose.KeyLike
}
const generateKeyPair = async (): Promise<KeyPair> => {
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, { modulusLength: 2048 })
  return { publicKey, privateKey }
}

const createToken = async (userToken: UserToken, privateKey: jose.KeyLike): Promise<string> => {
  // authorities in the session are always prefixed by ROLE.
  const authorities = userToken.roles?.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`)) || []
  const payload = {
    name: userToken.name || 'john smith',
    user_id: '123456789',
    user_name: 'USER1',
    scope: ['read'],
    auth_source: 'nomis',
    authorities,
    client_id: 'clientid',
  }

  const jsonwebtoken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setSubject('USER1')
    .setJti(uuidv4())
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(privateKey)

  console.log(jsonwebtoken)
  return jsonwebtoken
}

const getSignInUrl = (): Promise<string> =>
  getMatchingRequests({
    method: 'GET',
    urlPath: '/auth/oauth/authorize',
  }).then(data => {
    const { requests } = data.body
    const stateValue = requests[requests.length - 1].queryParams.state.values[0]
    return `/sign-in/callback?code=codexxxx&state=${stateValue}`
  })

const favicon = (): Request =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/favicon.ico',
    },
    response: {
      status: 200,
    },
  })

const ping = (): Request =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/health/ping',
    },
    response: {
      status: 200,
    },
  })

const redirect = (): Request =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=clientid',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      body: '<html><body>Sign in page<h1>Sign in</h1></body></html>',
    },
  })

const signOut = (): Request =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/sign-out.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body>Sign in page<h1>Sign in</h1></body></html>',
    },
  })

const manageDetails = (): Request =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/account-details.*',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body><h1>Your account details</h1></body></html>',
    },
  })

const token = (accessToken: string): Request =>
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3007/sign-in/callback?code=codexxxx&state=stateyyyy',
      },
      jsonBody: {
        access_token: accessToken,
        token_type: 'bearer',
        user_name: 'USER1',
        expires_in: 7200,
        scope: 'read',
        internalUser: true,
      },
    },
  })

const jwks = async (publicKey: jose.KeyLike): Promise<Request> => {
  const publicJwk = await jose.exportJWK(publicKey)

  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/.well-known/jwks.json',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        keys: [publicJwk],
      },
    },
  })
}

const stubSignIn = async (userToken: UserToken) => {
  const keyPair = await generateKeyPair()
  const accessToken = await createToken(userToken, keyPair.privateKey)

  return Promise.all([
    favicon(),
    redirect(),
    signOut(),
    token(accessToken),
    tokenVerification.stubVerifyToken(),
    jwks(keyPair.publicKey),
  ])
}

export default {
  getSignInUrl,
  stubAuthPing: ping,
  stubAuthManageDetails: manageDetails,
  stubSignIn,
}
