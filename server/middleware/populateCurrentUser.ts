import { RequestHandler } from 'express'
import { jwtDecode } from 'jwt-decode'
import logger from '../../logger'
import { convertToTitleCase } from '../utils/utils'
import UserCohortService from '../services/userCohortService'
import FeatureFlags from '../utils/featureFlags'

export default function populateCurrentUser(userCohortService: UserCohortService): RequestHandler {
  return async (req, res, next) => {
    const prisons = FeatureFlags.getInstance().getValue('TECHNOLOGY_PORTAL_PILOT_PRISONS').split(',') as string[]
    try {
      const {
        name,
        user_id: userId,
        authorities: roles = [],
      } = jwtDecode(res.locals.user.token) as {
        name?: string
        user_id?: string
        authorities?: string[]
      }

      if (userId === undefined || name === undefined) {
        throw new Error('There was a problem decoding the JWT')
      }
      const cohort = await userCohortService.getUserCohort(res.locals.user.token)
      res.locals.user = {
        ...res.locals.user,
        userId,
        name,
        displayName: convertToTitleCase(name),
        userRoles: roles.map(role => role.substring(role.indexOf('_') + 1)),
        cohort,
        cohortDisaplyName: convertToTitleCase(cohort.cohort.replace('_', ' ')),
        useTechnologyPortal: prisons.indexOf(cohort.activeCaseLoadId ?? '') !== -1,
      }
      if (res.locals.user.authSource === 'nomis') {
        res.locals.user.staffId = parseInt(userId, 10)
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate user details for: ${res.locals.user && res.locals.user.username}`)
      next(error)
    }
  }
}
