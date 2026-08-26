import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import paths from '../../../constants/paths'
import DeviceWearerSearchResultsService from './service'
import Model from './viewModel'

const FormModel = z.object({
  action: z.string().default('continue'),
  searchedIdentifier: z.string().trim().min(1),
})

export default class DeviceWearerSearchResultsController {
  constructor(private readonly service: DeviceWearerSearchResultsService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const searchedIdentifier = req.params.identifyNumber as string
    const searchResult = await this.service.getSearchResult({
      accessToken: res.locals.user.token,
      orderId: order.id,
      searchedIdentifier,
    })

    res.render(
      'pages/order/about-the-device-wearer/device-wearer-search-results',
      Model.construct(order.id, searchedIdentifier, searchResult, res.locals.content!, this.service),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { action, searchedIdentifier } = FormModel.parse(req.body)

    if (action === 'back') {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
      return
    }

    await this.service.confirmSearchResult({
      accessToken: res.locals.user.token,
      orderId: order.id,
      searchedIdentifier,
    })

    res.redirect(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id))
  }
}
