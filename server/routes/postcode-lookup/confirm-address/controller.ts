import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import PostcodeService from '../postcodeService'
import Model from './model'
import { AddressType, AddressWithoutType } from '../../../models/Address'
import I18n from '../../../types/i18n'
import TaskListService from '../../../services/taskListService'

export default class ConfirmAddressController {
  constructor(
    private readonly postcodeService: PostcodeService,
    private readonly tasklistService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const addressType = req.params.addressType as AddressType
    const postcode = req.query.postcode as string
    const buildingId = req.query.buildingId as string | undefined

    const address = order.addresses.find(item => item.addressType === addressType) as AddressWithoutType | undefined

    if (!address) {
      res.send(404)
      return
    }

    const useDifferentAddressLink =
      postcode === undefined
        ? paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType)
        : this.postcodeService.buildUrl(
            paths.POSTCODE_LOOKUP.ADDRESS_RESULT,
            order.id,
            addressType,
            postcode,
            buildingId,
          )

    const model = Model.construct(address, res.locals.content as I18n, {
      orderId: order.id,
      addressType,
      postcode,
      buildingId,
      useDifferentAddressLink,
    })

    res.render('pages/order/postcode-lookup/confirm-address', model)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const addressType = req.params.addressType.toUpperCase()

    const { action } = req.body

    if (action === 'continue') {
      if (addressType === 'INSTALLATION') {
        res.redirect(this.tasklistService.getNextPage('INSTALLATION_ADDRESS', order))
        return
      }

      res.redirect(paths.POSTCODE_LOOKUP.ADDRESS_LIST.replace(':orderId', order.id))
      return
    }

    res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
  }
}
