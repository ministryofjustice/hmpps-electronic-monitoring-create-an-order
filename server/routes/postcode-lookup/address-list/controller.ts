import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import TaskListService from '../../../services/taskListService'
import { ValidationResult } from '../../../models/Validation'
import { validationErrors } from '../../../constants/validationErrors'
import { AddressType } from '../../../models/Address'

const DEVICE_WEARER_ADDRESS_TYPES = ['PRIMARY', 'SECONDARY', 'TERTIARY'] as const

const isDeviceWearerAddress = ({ addressType }: { addressType: string }) =>
  (DEVICE_WEARER_ADDRESS_TYPES as readonly string[]).includes(addressType)

export default class AddressListController {
  constructor(private readonly taskService: TaskListService) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const errors = req.flash('validationErrors') as unknown as ValidationResult

    res.render('pages/order/postcode-lookup/address-list', ViewModel.construct(order, errors))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!

    const { addAnother } = req.body
    const deviceWearerAddresses = order.addresses.filter(isDeviceWearerAddress)

    if (!addAnother && deviceWearerAddresses.length < 3) {
      const errors: ValidationResult = [
        {
          error: validationErrors.postcodeLookup.addAnotherRequired,
          field: 'addAnother',
        },
      ]
      req.flash('validationErrors', errors)
      res.redirect(paths.POSTCODE_LOOKUP.ADDRESS_LIST.replace(':orderId', order.id))
      return
    }

    if (req.body.action === 'back') {
      res.redirect(res.locals.orderSummaryUri)
      return
    }

    if (addAnother === 'true') {
      const addressType: AddressType = deviceWearerAddresses.some(address => address.addressType === 'SECONDARY')
        ? 'TERTIARY'
        : 'SECONDARY'
      res.redirect(
        paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
      )
    } else {
      res.redirect(this.taskService.getNextPage('PRIMARY_ADDRESS', order))
    }
  }
}
