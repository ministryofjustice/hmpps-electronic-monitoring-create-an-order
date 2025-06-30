import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'
import { Order } from '../models/Order'
import paths from '../constants/paths'
import config from '../config'

type OrderSearchViewModel = {
  orders: Array<{
    displayName: string
    status: string
    type: string
    summaryUri: string
  }>
  variationsEnabled: boolean
  emptySearch?: boolean
  noResults?: boolean
}

const SearchOrderFormDataParser = z.object({
  searchTerm: z.string().nullable().optional(),
})

export default class OrderSearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderSearchService: OrderSearchService,
  ) {}

  private getDisplayName(order: Order): string {
    if (order.deviceWearer.firstName === null && order.deviceWearer.lastName === null) {
      if (order.type === 'VARIATION') {
        return 'New variation'
      }

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
          type: order.type,
          summaryUri: paths.ORDER.SUMMARY.replace(':orderId', order.id),
        }
      }),
      variationsEnabled: config.variations.enabled,
      noResults: orders.length === 0,
    }
  }

  list: RequestHandler = async (req: Request, res: Response) => {
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

  search: RequestHandler = async (req: Request, res: Response) => {
    const formData = SearchOrderFormDataParser.parse(req.body)

    if (formData.searchTerm === '') {
      const model: OrderSearchViewModel = {
        orders: [],
        emptySearch: true,
        variationsEnabled: config.variations.enabled,
      }
      res.render('pages/search', model)
      return
    }

    if (!formData.searchTerm) {
      const model: OrderSearchViewModel = {
        orders: [],
        variationsEnabled: config.variations.enabled,
      }
      res.render('pages/search', model)
      return
    }

    const orders = await this.orderSearchService.searchOrders({
      accessToken: res.locals.user.token,
      searchTerm: formData.searchTerm ?? '',
    })

    res.render('pages/search', this.constructViewModel(orders))
  }
}
