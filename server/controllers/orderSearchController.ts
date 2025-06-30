import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { Page } from '../services/auditService'
import { AuditService, OrderSearchService } from '../services'
import { Order } from '../models/Order'
import paths from '../constants/paths'
import config from '../config'

type OrderListViewModel = {
  orders: Array<{
    displayName: string
    status: string
    type: string
    summaryUri: string
  }>
  variationsEnabled: boolean
}

type OrderSearchViewModel = {
  orders: {
    text?: string | null | undefined
    html?: string
  }[][]
  variationsEnabled: boolean
  emptySearch?: boolean
  noResults?: boolean
  searchTerm?: string
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

  private constructListViewModel(orders: Array<Order>): OrderListViewModel {
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
    }
  }

  private createOrderItem = (order: Order) => {
    const nameLink = `<a class="govuk-link govuk-task-list__link" href=${paths.ORDER.SUMMARY.replace(':orderId', order.id)} aria-describedby="company-details-1-status">${this.getDisplayName(order)}</a>`
    return [
      {
        html: nameLink,
      },
      {
        text: order.deviceWearer.dateOfBirth,
      },
      {
        text: order.deviceWearer.pncId,
      },
      {
        text: 'blah',
      },
      {
        text: order.curfewConditions?.startDate,
      },
      {
        text: order.curfewConditions?.endDate,
      },
      {
        text: order.fmsResultDate,
      },
    ]
  }
  private constructSearchViewModel(orders: Array<Order>): OrderSearchViewModel {
    return {
      orders: orders.map(order => this.createOrderItem(order)),
      variationsEnabled: config.variations.enabled,
    }
  }

  list: RequestHandler = async (req: Request, res: Response) => {
    await this.auditService.logPageView(Page.ORDER_SEARCH_PAGE, {
      who: res.locals.user.username,
      correlationId: req.id,
    })

    try {
      const orders = await this.orderSearchService.searchOrders({ accessToken: res.locals.user.token, searchTerm: '' })

      res.render('pages/index', this.constructListViewModel(orders))
    } catch (e) {
      res.render('pages/index', this.constructListViewModel([]))
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
      searchTerm: formData.searchTerm,
    })

    if (orders.length === 0) {
      const model: OrderSearchViewModel = {
        orders: [],
        searchTerm: formData.searchTerm,
        variationsEnabled: config.variations.enabled,
        noResults: true,
      }
      res.render('pages/search', model)
      return
    }

    res.render('pages/search', this.constructSearchViewModel(orders))
  }
}
