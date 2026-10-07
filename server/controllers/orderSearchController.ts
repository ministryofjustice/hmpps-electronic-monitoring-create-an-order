import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'
import { constructSearchViewModel, constructListViewModel, OrderSearchViewModel } from '../models/form-data/search'
import logger from '../../logger'
import { getOrderListViewsForCohort, ListOrdersQueryParser } from '../models/form-data/OrderListView'

const SearchOrderFormDataParser = z.object({
  searchTerm: z.string().nullable().optional(),
})

const IsPrisonOrYouthUser = (res: Response): boolean => {
  const cohort = res.locals.user.cohort?.cohort
  return cohort === 'PRISON'
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
    const cohort = res.locals.user.cohort?.cohort
    const isPrisonOrYouthUser = IsPrisonOrYouthUser(res)
    const availableViews = getOrderListViewsForCohort(cohort)
    const { view: requestedView, page, size } = ListOrdersQueryParser.parse(req.query)
    const view = availableViews.includes(requestedView) ? requestedView : availableViews[0]

    try {
      const orders = await this.orderSearchService.listOrders({ accessToken: res.locals.user.token }, view, page, size)

      res.render('pages/index', constructListViewModel(orders, view, isPrisonOrYouthUser, availableViews))
    } catch (e) {
      logger.warn(`List orders ${e} `)
      res.render(
        'pages/index',
        constructListViewModel({ content: [], page, size, hasNext: false }, view, isPrisonOrYouthUser, availableViews),
      )
    }
  }

  search: RequestHandler = async (req: Request, res: Response) => {
    const formData = SearchOrderFormDataParser.parse(req.query)

    if (formData.searchTerm === undefined || formData.searchTerm === null) {
      const model: OrderSearchViewModel = {
        orders: [],
      }
      res.render('pages/search', model)
      return
    }

    if (formData.searchTerm.trim() === '') {
      const model: OrderSearchViewModel = {
        orders: [],
        emptySearch: true,
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
