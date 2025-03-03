import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService } from '../../services'
import AddressService from '../../services/addressService'
import { isValidationResult } from '../../models/Validation'
import TaskListService, { Page } from '../../services/taskListService'
import AddressFormDataModel from '../../models/form-data/address'
import addressViewModel from '../../models/view-models/address'

export default class AddressController {
  constructor(
    private readonly auditService: AuditService,
    private readonly addressService: AddressService,
    private readonly taskListService: TaskListService,
  ) {}

  getCurrentPage(addressType: string): Page {
    if (addressType.toUpperCase() === 'INSTALLATION') {
      return 'INSTALLATION_ADDRESS'
    }

    if (addressType.toUpperCase() === 'SECONDARY') {
      return 'SECONDARY_ADDRESS'
    }

    if (addressType.toUpperCase() === 'TERTIARY') {
      return 'TERTIARY_ADDRESS'
    }

    return 'PRIMARY_ADDRESS'
  }

  getCurrentPageUrl(addressType: string) {
    if (addressType.toUpperCase() === 'INSTALLATION') {
      return paths.MONITORING_CONDITIONS.INSTALLATION_ADDRESS.replace(':addressType(installation)', addressType)
    }

    return paths.CONTACT_INFORMATION.ADDRESSES.replace(':addressType(primary|secondary|tertiary)', addressType)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { addressType } = req.params
    const { addresses } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = addressViewModel.construct(addressType, addresses, formData[0] as never, errors as never)

    res.render('pages/order/contact-information/address', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId, addressType } = req.params
    const { action, hasAnotherAddress, ...formData } = AddressFormDataModel.parse(req.body)

    const result = await this.addressService.updateAddress({
      accessToken: res.locals.user.token,
      orderId,
      data: {
        addressType: addressType.toUpperCase(),
        ...formData,
      },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(this.getCurrentPageUrl(addressType).replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(
        this.taskListService.getNextPage(this.getCurrentPage(addressType), req.order!, {
          hasAnotherAddress: hasAnotherAddress === 'true',
          addressType,
        }),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
