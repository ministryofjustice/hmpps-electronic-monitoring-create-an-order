import { NextFunction, Request, RequestParamHandler, Response } from 'express'
import logger from '../../logger'
import paths from '../constants/paths'
import { OrderStatusEnum } from '../models/Order'
import { OrderService } from '../services'

const populateOrder =
  (orderService: OrderService): RequestParamHandler =>
  async (req: Request, res: Response, next: NextFunction, orderId: string) => {
    try {
      const { token } = res.locals.user
      const order = await orderService.getOrder({ accessToken: token, orderId })

      req.order = order
      res.locals.orderId = order.id
      res.locals.isOrderEditable = order.status === OrderStatusEnum.Enum.IN_PROGRESS
      res.locals.orderSummaryUri = paths.ORDER.SUMMARY.replace(':orderId', order.id)
      if (order.fmsResultDate) {
        res.locals.submittedDate = getFormattedDate(order.fmsResultDate)
      }

      next()
    } catch (error) {
      logger.error(error, `Failed to populate order details for: ${orderId}`)
      next(error)
    }
  }

const getFormattedDate = (dateToFormat: string): string => {
  const date = new Date(dateToFormat)
  const month = date.toLocaleString('default', { month: 'long' })
  return date.getDate() + ' ' + month + ' ' + date.getFullYear()
}

export default populateOrder
