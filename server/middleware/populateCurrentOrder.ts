import { RequestParamHandler, Request, Response, NextFunction } from 'express'
import logger from '../../logger'
import { OrderService } from '../services'
import { OrderStatusEnum } from '../models/Order'

const populateOrder =
  (orderService: OrderService): RequestParamHandler =>
  async (req: Request, res: Response, next: NextFunction, orderId: string) => {
    try {
      const { token } = res.locals.user
      const order = await orderService.getOrder({ accessToken: token, orderId })

      req.order = order
      res.locals.orderId = order.id
      res.locals.isOrderEditable = order.status === OrderStatusEnum.Enum.IN_PROGRESS

      next()
    } catch (error) {
      logger.error(error, `Failed to populate order details for: ${orderId}`)
      next(error)
    }
  }

export default populateOrder
