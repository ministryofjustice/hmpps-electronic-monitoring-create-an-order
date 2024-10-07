import { RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

const getBuilder =
  (router: Router) =>
  (path: string | string[], ...handlers: RequestHandler[]) =>
    router.get(
      path,
      handlers.map(handler => asyncMiddleware(handler)),
    )

const postBuilder =
  (router: Router) =>
  (path: string | string[], ...handlers: RequestHandler[]) =>
    router.post(
      path,
      handlers.map(handler => asyncMiddleware(handler)),
    )

export { getBuilder, postBuilder }
