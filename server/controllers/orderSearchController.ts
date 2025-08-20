import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'
import config from '../config'
import { constructSearchViewModel, constructListViewModel, OrderSearchViewModel } from '../models/form-data/search'

const SearchOrderFormDataParser = z.object({
  searchTerm: z.string().nullable().optional(),
})

export default class OrderSearchController {
  constructor(
    private readonly auditService: AuditService,
    private readonly orderSearchService: OrderSearchService,
  ) {}

  list: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_SEARCH_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const orders = await this.orderSearchService.listOrders({ accessToken: res.locals.user.token })

      res.render('pages/index', constructListViewModel(orders))
    } catch (e) {
      res.render('pages/index', constructListViewModel([]))
    }
  }

  search: RequestHandler = async (req: Request, res: Response) => {
    const formData = SearchOrderFormDataParser.parse(req.query)

    if (formData.searchTerm === '') {
      const model: OrderSearchViewModel = {
        orders: [],
        emptySearch: true,
        variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
      }
      res.render('pages/search', model)
      return
    }

    if (!formData.searchTerm) {
      const model: OrderSearchViewModel = {
        orders: [],
        variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
      }
      res.render('pages/search', model)
      return
    }

    const orders = await this.orderSearchService.searchOrders({
      accessToken: res.locals.user.token,
      searchTerm: formData.searchTerm,
    })

    const model = constructSearchViewModel(orders, formData.searchTerm)
    if (orders.length === 0) {
      model.searchTerm = formData.searchTerm
      model.noResults = true
    }

    res.render('pages/search', model)
  }
}
