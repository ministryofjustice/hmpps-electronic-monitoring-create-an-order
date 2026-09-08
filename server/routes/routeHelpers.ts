import { type PathParams } from 'express-serve-static-core'
import { type RequestHandler, type Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export interface ViewUpdateController {
  view: RequestHandler
  update: RequestHandler
}

export const registerViewUpdate = (router: Router, path: PathParams, controller: ViewUpdateController): void => {
  router.route(path).get(asyncMiddleware(controller.view)).post(asyncMiddleware(controller.update))
}

export const relativePath = (basePath: string, path: string): string => path.replace(basePath, '') || '/'

export default registerViewUpdate
