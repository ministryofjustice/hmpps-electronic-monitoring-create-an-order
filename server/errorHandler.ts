import type { Request, Response, NextFunction } from 'express'
import logger from '../logger'
import { SanitisedError } from './sanitisedError'
import { reportException } from './utils/azureAppInsights'

export default function createErrorHandler(production: boolean) {
  return (error: SanitisedError, req: Request, res: Response, next: NextFunction): void => {
    const context = {
      method: req.method,
      path: req.path,
      route: req.route?.path,
      status: error.status || 500,
      orderId: req.params.orderId || res.locals.orderId,
      versionId: req.params.versionId || res.locals.versionId,
      operationId: res.locals.operationId,
    }
    logger.error({ err: error, ...context }, 'Error handling request')
    if (context.status >= 500) reportException(error, context)

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = error.status
    res.locals.stack = production ? null : error.stack

    if (error.status === 403 && error.data?.errorCode === '40301') {
      return res.status(403).render('pages/error-pages/403')
    }

    if (error.status === 401 || error.status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }
    if (error.status === 404) {
      res.statusCode = 404
      return res.render('pages/error-pages/404')
    }

    res.status(error.status || 500)

    return res.render('pages/error-pages/500')
  }
}
