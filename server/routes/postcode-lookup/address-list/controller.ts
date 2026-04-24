import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import TaskListService from '../../../services/taskListService'
import { ValidationResult } from '../../../models/Validation'

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

    if (!addAnother && order.addresses.length < 3) {
      const errors: ValidationResult = [
        {
          error: 'Select Yes if there are any other addresses where the device wearer will be during curfew hours',
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
      res.redirect(
        paths.POSTCODE_LOOKUP.FIND_ADDRESS.replace(':orderId', order.id).replace(':addressType', 'SECONDARY'),
      )
    } else {
      res.redirect(this.taskService.getNextPage('PRIMARY_ADDRESS', order))
    }
  }
}
