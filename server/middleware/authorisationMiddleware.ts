import { jwtDecode } from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'
import asyncMiddleware from './asyncMiddleware'

export enum HMPPS_AUTH_ROLES {
  ROLE_EM_CEMO__CREATE_ORDER = 'ROLE_EM_CEMO__CREATE_ORDER',
}

export const cemoAuthorisedRoles = () => {
  return Object.keys(HMPPS_AUTH_ROLES).map(key => HMPPS_AUTH_ROLES[key as keyof typeof HMPPS_AUTH_ROLES])
}

export default function authorisationMiddleware(authorisedRoles: string[] = []): RequestHandler {
  return asyncMiddleware((req, res, next) => {
    // authorities in the user token will always be prefixed by ROLE_.
    // Convert roles that are passed into this function without the prefix so that we match correctly.
    const authorisedAuthorities = authorisedRoles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))

    if (res.locals?.user?.token) {
      const { authorities: roles = [] } = jwtDecode(res.locals.user.token) as { authorities?: string[] }
      if (authorisedAuthorities.length && !roles.some(role => authorisedAuthorities.includes(role))) {
        logger.error('User is not authorised to access this')
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/')
  })
}
