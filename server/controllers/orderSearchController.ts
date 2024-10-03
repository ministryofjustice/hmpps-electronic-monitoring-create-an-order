import { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'
import { Order } from '../models/Order'
import paths from '../constants/paths'

type OrderSearchViewModel = {
  orders: Array<{
    displayName: string
    status: string
    summaryUri: string
  }>
}

export default class OrderSearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderSearchService: OrderSearchService,
  ) {}

  private getDisplayName(order: Order): string {
    if (order.deviceWearer.firstName === null && order.deviceWearer.lastName === null) {
      return 'New form'
    }

    return `${order.deviceWearer.firstName || ''} ${order.deviceWearer.lastName || ''}`
  }

  private constructViewModel(orders: Array<Order>): OrderSearchViewModel {
    return {
      orders: orders.map(order => {
        return {
          displayName: this.getDisplayName(order),
          status: order.status,
          summaryUri: paths.ORDER.SUMMARY.replace(':orderId', order.id),
        }
      }),
    }
  }

  search: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_SEARCH_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const orders = await this.orderSearchService.searchOrders({ accessToken: res.locals.user.token, searchTerm: '' })

      res.render('pages/index', this.constructViewModel(orders))
    } catch (e) {
      res.render('pages/index', this.constructViewModel([]))
    }
  }
}
