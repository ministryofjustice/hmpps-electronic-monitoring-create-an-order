import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'
import config from '../config'
import { constructSearchViewModel, constructListViewModel, OrderSearchViewModel } from '../models/form-data/search'
import logger from '../../logger'
import { ListOrdersQueryParser } from '../models/form-data/OrderListView'

const SearchOrderFormDataParser = z.object({
  searchTerm: z.string().nullable().optional(),
})

const IsPrisonOrYouthUser = (res: Response): boolean => {
  const cohort = res.locals.user.cohort?.cohort
  return cohort === 'PRISON' // youth prison?
}

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
    const canFilterViews = IsPrisonOrYouthUser(res)
    const { view: requestedView } = ListOrdersQueryParser.parse(req.query)
    const view = canFilterViews ? requestedView : 'MY_ORDERS'

    try {
      const orders = await this.orderSearchService.listOrders({ accessToken: res.locals.user.token }, view)

      res.render('pages/index', constructListViewModel(orders, view, canFilterViews))
    } catch (e) {
      logger.warn(`List orders ${e} `)
      res.render('pages/index', constructListViewModel([], view, canFilterViews))
    }
  }

  search: RequestHandler = async (req: Request, res: Response) => {
    const formData = SearchOrderFormDataParser.parse(req.query)

    if (formData.searchTerm === undefined || formData.searchTerm === null) {
      const model: OrderSearchViewModel = {
        orders: [],
        variationAsNewOrderEnabled: config.variationAsNewOrder.enabled,
      }
      res.render('pages/search', model)
      return
    }

    if (formData.searchTerm.trim() === '') {
      const model: OrderSearchViewModel = {
        orders: [],
        emptySearch: true,
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
