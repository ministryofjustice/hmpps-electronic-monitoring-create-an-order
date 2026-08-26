import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { DeviceWearerFormDataParser, IdentityNumbersFormDataModel } from '../../models/form-data/deviceWearer'
import deviceWearerViewModel from '../../models/view-models/deviceWearer'
import identityNumbersViewModel from '../../models/view-models/identityNumbers'
import DeviceWearerService from '../../services/deviceWearerService'
import TaskListService from '../../services/taskListService'

export default class DeviceWearerController {
  constructor(
    private readonly deviceWearerService: DeviceWearerService,
    private readonly taskListService: TaskListService,
  ) {}

  viewDeviceWearer: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render(
      'pages/order/about-the-device-wearer/device-wearer',
      deviceWearerViewModel.construct(
        order.deviceWearer,
        formData.length > 0 ? (formData[0] as never) : ({} as never),
        errors as never,
      ),
    )
  }

  updateDeviceWearer: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string
    const { action, ...formData } = DeviceWearerFormDataParser.parse(req.body)

    const result = await this.deviceWearerService.updateDeviceWearer({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(
        this.taskListService.getNextPage('DEVICE_WEARER', {
          ...req.order!,
          deviceWearer: result,
        }),
      )
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }

  viewIdentityNumbers: RequestHandler = async (req, res) => {
    const order = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render(
      'pages/order/about-the-device-wearer/identity-numbers',
      identityNumbersViewModel.construct(order, res.locals.user.cohort?.cohort, formData[0] as never, errors as never),
    )
  }

  updateIdentityNumbers: RequestHandler = async (req, res) => {
    const order = req.order!
    const { action, ...formData } = IdentityNumbersFormDataModel.parse(req.body)

    const result = await this.deviceWearerService.updateIdentityNumbers({
      accessToken: res.locals.user.token,
      orderId: order.id,
      data: {
        ...formData,
        homeOfficeReferenceNumber: order.deviceWearer.homeOfficeReferenceNumber ?? '',
      },
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      res.redirect(paths.ABOUT_THE_DEVICE_WEARER.IDENTITY_NUMBERS.replace(':orderId', order.id))
    } else if (action === 'continue') {
      if (
        order.interestedParties?.notifyingOrganisation === 'PRISON' ||
        order.interestedParties?.notifyingOrganisation === 'YOUTH_CUSTODY_SERVICE'
      ) {
        res.redirect(
          paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_SEARCH_RESULTS.replace(':orderId', order.id).replace(
            ':identifyNumber',
            formData.nomisId!,
          ),
        )
      } else if (order.interestedParties?.notifyingOrganisation === 'PROBATION') {
        res.redirect(
          paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER_SEARCH_RESULTS.replace(':orderId', order.id).replace(
            ':identifyNumber',
            formData.deliusId!,
          ),
        )
      } else {
        res.redirect(paths.ABOUT_THE_DEVICE_WEARER.DEVICE_WEARER.replace(':orderId', order.id))
      }
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', order.id))
    }
  }
}
