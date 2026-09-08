import { type PathParams } from 'express-serve-static-core'
import { type RequestHandler, type RouterOptions, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export interface ViewUpdateController {
  view: RequestHandler
  update: RequestHandler
}

export const registerViewUpdate = (router: Router, path: PathParams, controller: ViewUpdateController): void => {
  router.route(path).get(asyncMiddleware(controller.view)).post(asyncMiddleware(controller.update))
}

export const relativePath = (basePath: string, path: string): string => path.replace(basePath, '') || '/'

export interface FeatureRouter {
  router: Router
  get: (path: string, ...handlers: RequestHandler[]) => Router
  post: (path: string, ...handlers: RequestHandler[]) => Router
  rel: (path: string) => string
  viewUpdate: (path: string, controller: ViewUpdateController) => void
}

export const createFeatureRouter = (basePath = '', options: RouterOptions = { mergeParams: true }): FeatureRouter => {
  const router = Router(options)
  const rel = (path: string) => relativePath(basePath, path)
  const get = (path: string, ...handlers: RequestHandler[]) => router.get(rel(path), ...handlers.map(asyncMiddleware))
  const post = (path: string, ...handlers: RequestHandler[]) => router.post(rel(path), ...handlers.map(asyncMiddleware))
  const viewUpdate = (path: string, controller: ViewUpdateController) =>
    registerViewUpdate(router, rel(path), controller)

  return { router, get, post, rel, viewUpdate }
}

export default registerViewUpdate
