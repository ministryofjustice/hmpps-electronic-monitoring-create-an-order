import { Request, RequestHandler, Response } from 'express'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'

export default class OrderSearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderSearchService: OrderSearchService,
  ) {}

  search: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_SEARCH_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const orders = await this.orderSearchService.searchOrders({ accessToken: res.locals.user.token, searchTerm: '' })

      res.render('pages/index', { orderList: orders })
    } catch (e) {
      res.render('pages/index', { orderList: [] })
    }
  }
}
