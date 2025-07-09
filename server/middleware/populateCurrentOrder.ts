import { NextFunction, Request, RequestParamHandler, Response } from 'express'
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
      const order = await orderService.getOrder({ accessToken: token, orderId })

      req.order = order
      res.locals.orderId = order.id
      res.locals.orderStatus = order.status
      res.locals.isOrderEditable = order.status === OrderStatusEnum.Enum.IN_PROGRESS
      res.locals.orderSummaryUri = paths.ORDER.SUMMARY.replace(':orderId', order.id)     
      res.locals.content = getContent(Locales.en, order.dataDictionaryVersion)
      next()
    } catch (error) {
      logger.error(error, `Failed to populate order details for: ${orderId}`)
      next(error)
    }
  }

export default populateOrder
