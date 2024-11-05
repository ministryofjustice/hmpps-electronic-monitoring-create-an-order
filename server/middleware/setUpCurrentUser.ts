import { Router } from 'express'

import populateCurrentUser from './populateCurrentUser'
import auth from '../authentication/auth'
import tokenVerifier from '../data/tokenVerification'

export default function setUpCurrentUser(): Router {
  const router = Router({ mergeParams: true })
  router.use(auth.authenticationMiddleware(tokenVerifier))
  router.use(populateCurrentUser())
  return router
}
