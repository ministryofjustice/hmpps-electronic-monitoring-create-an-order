import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import paths from '../../../constants/paths'
import DeviceWearerSearchResultsService from './service'
import DeviceWearerAnswersService from '../deviceWearerAnswersService'
import Model from './viewModel'
import logger from '../../../../logger'
import { SanitisedError } from '../../../sanitisedError'

const FormModel = z.object({
  action: z.string().default('continue'),
  searchedIdentifier: z.string().trim().min(1),
})

export default class DeviceWearerSearchResultsController {
  constructor(
    private readonly service: DeviceWearerSearchResultsService,
    private readonly deviceWearerAnswersService: DeviceWearerAnswersService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const searchedIdentifier = req.params.identifyNumber as string

    let searchResult
    try {
      searchResult = await this.service.getSearchResult({
        accessToken: res.locals.user.token,
        orderId: order.id,
        searchedIdentifier,
      })
    } catch (error) {
      const status = (error as SanitisedError).status ?? 0

      if (status < 500) {
        throw error
      }

      logger.error(error)
      res.redirect(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL.replace(':orderId', order.id))
      return
    }

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

    // The person is saved, so a failure to apply the gender default should not stop the user continuing
    try {
      const deviceWearer = await this.service.getStoredDeviceWearer({
        accessToken: res.locals.user.token,
        orderId: order.id,
      })
      await this.deviceWearerAnswersService.defaultGenderAfterCprLookup({ ...order, deviceWearer })
    } catch (error) {
      logger.error(
        { status: (error as SanitisedError).status, errorName: (error as Error).name },
        `Failed to apply the CPR gender default for order ${order.id}`,
      )
    }

    res.redirect(paths.ABOUT_THE_DEVICE_WEARER.BASE_URL.replace(':orderId', order.id))
  }
}
