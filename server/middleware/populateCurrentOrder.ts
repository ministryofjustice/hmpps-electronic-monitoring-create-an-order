import { NextFunction, Request, RequestParamHandler, Response } from 'express'
import { validate } from 'uuid'
import logger from '../../logger'
import paths from '../constants/paths'
import { OrderStatusEnum } from '../models/Order'
import { OrderService } from '../services'
import getContent from '../i18n'
import { Locales } from '../types/i18n/locale'

const populateOrder =
  (orderService: OrderService): RequestParamHandler =>
  async (req: Request, res: Response, next: NextFunction, orderId: string) => {
    try {
      const { token } = res.locals.user
      const { versionId } = req.params

      if (orderId && validate(orderId)) {
        let order

        if (versionId && validate(versionId)) {
          order = await orderService.getVersion({ accessToken: token, orderId, versionId })
          res.locals.orderSummaryUri = paths.ORDER.SUMMARY.replace(':orderId', order.id).replace(
            `order/${order.id}/`,
            `order/${order.id}/version/${versionId}/`,
          )
          res.locals.versionId = versionId
        } else {
          order = await orderService.getOrder({ accessToken: token, orderId })
          res.locals.orderSummaryUri = paths.ORDER.SUMMARY.replace(':orderId', order.id)
        }
        req.order = order
        res.locals.orderId = order.id
        res.locals.orderStatus = order.status
        res.locals.isOrderEditable = order.status === OrderStatusEnum.Enum.IN_PROGRESS
        res.locals.content = getContent(Locales.en, order.dataDictionaryVersion)
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate order details for: ${orderId}`)
      next(error)
    }
  }

export default populateOrder
