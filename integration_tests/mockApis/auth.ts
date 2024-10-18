import * as jose from 'jose'
import { Request } from 'superagent'

import { stubFor, getMatchingRequests } from './wiremock'
import tokenVerification from './tokenVerification'

const alg = 'RS256'

type KeyPair = {
  publicKey: jose.JWK
  privateKey: jose.JWK
}

const keyPair: KeyPair = {
  publicKey: {
    kty: 'RSA',
    n: 'uuSFSdEC8BesPaO9B-oSvfZ42Gcb4LWbHt11U1jSL_OBM_eZqzON1rghzJrL3BFutrXTLTZYAk6B82z_CNP14z3mx5xAJJ0CHkcaXIpuro8g3LxWDhuLbCfLw8HcXZ8_004NFwcv2492x-J0Z7kiRVBlMbYYWz2ra9JxhUriXtD53K-8HOg3LO85WFS1WH8kdwuVPkWfMNXJHPijAxmZtu1Fj91o78ZSEaLb3Tn0pUdcTmy2I1a-b1s7TT3MKUiDj4R9wSij8r1U4vRY7Wk4GAx7DICMsHct0q3bvV1WGuNQhC9URj9wBN4cqqlzGvmwpj_yyTxUV0M98j1fAs_qCQ',
    e: 'AQAB',
  },
  privateKey: {
    kty: 'RSA',
    n: 'uuSFSdEC8BesPaO9B-oSvfZ42Gcb4LWbHt11U1jSL_OBM_eZqzON1rghzJrL3BFutrXTLTZYAk6B82z_CNP14z3mx5xAJJ0CHkcaXIpuro8g3LxWDhuLbCfLw8HcXZ8_004NFwcv2492x-J0Z7kiRVBlMbYYWz2ra9JxhUriXtD53K-8HOg3LO85WFS1WH8kdwuVPkWfMNXJHPijAxmZtu1Fj91o78ZSEaLb3Tn0pUdcTmy2I1a-b1s7TT3MKUiDj4R9wSij8r1U4vRY7Wk4GAx7DICMsHct0q3bvV1WGuNQhC9URj9wBN4cqqlzGvmwpj_yyTxUV0M98j1fAs_qCQ',
    e: 'AQAB',
    d: 'PP_iaz3vjgrD-phrVd52AI-mUMeSp0zPFQtmRG5sqB770Ejj3Kemh2sxCPWLTUhZUQRWqV6f6hzSuG-ebDS2gFWPch5TJ0Ah1V0Swxqh1pK7wKAuHEusPYBdtwaa1Onp7J-AkUAUxD52n_YPVV1tTJ9ZcBjFqV4fCcG1sLJI4XYWhQfU_bf1LnpBp4Tx4EQoqemvn66Cyrng7K2NKbKE244S6IFvXX1Qf3O4vD81XzuRaiqq4q6p4MJbfMLvS3tW2jTXBhm3UvcI8DCm1uJzqwc__aIC9QpiE6VTM7W2DiOkunyzZY2a9UL3IPQ1JUlAHrezHD3L_zhNSGTpMBqOow',
    p: '_aFHilmowkgFsr-3yOEpIRQKN7pn06cZHMSjJpEnbVEH6ZXuKgi4HKk-YuOmXmVa_9Qb4Pp2r631Zh_hnWKXtNf-SseUdLxFBxOrYFIzwiua6SK3LzjfaeuDKK2iQ2AdSUtlkKXIgLCRyQjHRDLHGxt8i2nzQipN7-bmZpjHlpc',
    q: 'vKOYeQZuMtT9V9QCNaQ7tuw7PeQ05FnHi1Y6VTF8CxckTI-Hka-FrDLBbNuV5rqPM3wdrlyHOZbwURFZnvPZm69iO5SgYXIsc84hCi5F86o2zqVZEy59F-M5e071V4LVQ9Tz2ES5ck7S4KCkDO-mHJgzD4c_WaXcU-f_AU5iOF8',
    dp: '35dBiT7XXka990G6VHXim02eYFiNVXI22jyjk8ldF6rardrF9fpvzJyK6gTE0uzJV0T3OtOys9dIwjoS3HthQEU14VimkG6077MwXp65EFD-pM487X1Wv3qmysKfjIP77XRxWh48bu655p89g-q7yjLmDcVedRL0WCyXKxU-xos',
    dq: 'jGr6xJwUy6HgM9CNFID8Ml4Gezu0Y4axEvdM1L3RKDBBxPvSXo_ZYSUm9nE-VFHq5tgs_-3Aew3wNWhE3h2Gjm0vIkqwV9k1Xb7CuWFYkNjTk19hvvWMCIwL7c4Isuug9K1AFmyR3pTuRGdPtpFthTuGRrjWX1UnfQ3ktIQ0eOE',
    qi: '6VYm6CiF9RY0IvblSJ92lvJc5PLVJVNyTMVV8UjFKk2lLAY5irB8Uzf5eD4eisvrdiCphDPFGaPgUWYvha73KAFfyBQrdlmBCEu94AQuPUlA6HUCu5ziUwKZh_OfJbmQAB4V0QznBXxJ_kqqVOc11WXw_WKyyF3kVYRw8kqDOmQ',
  },
}

const unverifiableKeyPair: KeyPair = {
  publicKey: {
    kty: 'RSA',
    n: 'jdtb5ck3dyigEtvD6hpBfwkjeyWgdCObjHOm3jNb1QebhMswnCWf2lQzad3Y-eCuWtNBQh0KmCeBBGkqacdXqH9TW-YAjZy4A3apyhxeF7pX_7xLcwfAOxGFFkSLo-u6mrX9za3v2O75J5mAfl7Y9MJ8phg8zuYZSydDT4oNPXKqyRDv6ql45sO4rIWHxNVKq80_vQeUBICtZ759c7T2ThV58-B2NieCmXiIMmFeJzKWHMQybJ67Xm1Hrse1c1nUPcwdvK02_vpA6xQP4oq6nNX6R7qxLnJCJRI1ij7Tcu2ETTwzK0RuflCqH3IWAK8zSypdO0K-annU8Abprw0zeQ',
    e: 'AQAB',
  },
  privateKey: {
    kty: 'RSA',
    n: 'jdtb5ck3dyigEtvD6hpBfwkjeyWgdCObjHOm3jNb1QebhMswnCWf2lQzad3Y-eCuWtNBQh0KmCeBBGkqacdXqH9TW-YAjZy4A3apyhxeF7pX_7xLcwfAOxGFFkSLo-u6mrX9za3v2O75J5mAfl7Y9MJ8phg8zuYZSydDT4oNPXKqyRDv6ql45sO4rIWHxNVKq80_vQeUBICtZ759c7T2ThV58-B2NieCmXiIMmFeJzKWHMQybJ67Xm1Hrse1c1nUPcwdvK02_vpA6xQP4oq6nNX6R7qxLnJCJRI1ij7Tcu2ETTwzK0RuflCqH3IWAK8zSypdO0K-annU8Abprw0zeQ',
    e: 'AQAB',
    d: 'CJjlKYifvs4koGv3BEy90DEJuFSMFEnVqyYVtIUEkWU-AsbtPeNmXB0rBgUi2acJLho8S-FWc2j-f9nPTxyclorL7qeCfFKlkNkr2mLMfY_mtiovYOv09ad-yz4Rf_hhBXAW7xSV8w3tpf2evNnq-G-Cji7tHYVyvjwlj1AgtAr0Tzsnolp8uSBAdFn7PuNfeNYrNcohAgYRezOLBcR2GK0Y8YYyFtRrb27WHGmrhoVD2Jsoc_aC2Y1Y3Ym4rZ9iHYizc1Bk8vvlBendJSMJNT-aQklIHscE9bVtmd1gEc1p3kMkcpCDDGvbUwKFvOXTtahPd15NXY1KkT9lSgxBgQ',
    p: 'vvL4j9HyBU6EK86j6kjMK8pQM_qtmQ9ZOELt-_QqVtoxOvxCKHhA864cK9f5h46qBS0_JX8I82PJQLLsCXjj0QYbP_IB3wDvSOsU1mcrp8cvwjhkjUH1kjkuuGDJq-1yFvzm9n3x5nWCkPguVpnwFxsC_jJUUeM_FASscT1SEYE',
    q: 'vi72XF-0N0RtsYzPtxCRgziOPm4dDYjT3IqkESskHmy3e8uQT14bQ48WKxxoX71sGDDd74mlCVKM3JbOVxhzsWppSLfylnrA862JUdx9nDbdbkOfG3wSWzs6y4KU8S0JjziQrnrf0EQ8rRDghaocrmCCLYPoJhs-hDOySRtmrfk',
    dp: 'j3gNbDoJRxV0V1nebNSfmzNaSYPK1Vrj5VLcbtdIzJMKNFB_ANtBqhWikwqmMMTvWA5kCK9HMWBDQTpuALv1KAMXjFcwMrcIEtiWgnVoJpqRdrNaUYxCj8gpI12NiYFRnJYOjxuYGlkmbfgbEPR-oU2pVQbJtfExXsAYNMknFYE',
    dq: 'LwLc0yi1G5RGqUTtc4sc7RrlznjZpabU-ActVzEa1Ip7MJa5LWVNx_1utWloQ4JHXhN2SOf1a8CEIWMFznG0534uWFNgG-JsH9AdyaZ_RkYppkAA7IJW50ZU2kmFF7jSTBznZrno6Up01TL-zQun21Lv2uBoWkMRyQweXgPv9cE',
    qi: 'GmxbrYWljVsqo2aoXlFGTIDfOriPWk2znfyhCCfZJ1f6FKRBx6AkipR4ZWke3aMhYagyjsHI7iKls9apsQ-41Wq2i4capwjgsWHA_0glahsZpEIA26_qSVH1EZJy0R51-Q7sKTgdUxrvVhmUXP3iBiAJ2PJBlajTo_bYSZrKMZY',
  },
}

interface UserToken {
  name?: string
  roles?: string[]
}
const createToken = async (userToken: UserToken): Promise<string> => {
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
    .setSubject(payload.user_name)
    .setJti('83b50a10-cca6-41db-985f-e87efb303ddb')
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(keyPair.privateKey)

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

const jwks = async (publicKey: jose.JWK): Promise<Request> => {
  return stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/.well-known/jwks.json',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        keys: [publicKey],
      },
    },
  })
}

const stubSignIn = async (userToken: UserToken) => {
  const accessToken = await createToken(userToken)

  return Promise.all([
    favicon(),
    redirect(),
    signOut(),
    token(accessToken),
    tokenVerification.stubVerifyToken(true),
    jwks(keyPair.publicKey),
  ])
}

const stubUnverifiableSignIn = async (userToken: UserToken) => {
  const accessToken = await createToken(userToken)

  return Promise.all([
    favicon(),
    redirect(),
    signOut(),
    token(accessToken),
    tokenVerification.stubVerifyToken(false),
    jwks(unverifiableKeyPair.publicKey),
  ])
}

export default {
  getSignInUrl,
  stubAuthPing: ping,
  stubAuthManageDetails: manageDetails,
  stubSignIn,
  stubUnverifiableSignIn,
  ...tokenVerification,
}
