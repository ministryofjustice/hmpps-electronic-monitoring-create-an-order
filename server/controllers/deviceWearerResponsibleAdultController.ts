import z from 'zod'
import { Request, RequestHandler, Response } from 'express'
import { DeviceWearerResponsibleAdult } from '../models/DeviceWearerResponsibleAdult'
import { AuditService } from '../services'
import { TextField } from '../models/view-models/utils'
import paths from '../constants/paths'
import { isValidationResult, ValidationResult } from '../models/Validation'
import { getError } from '../utils/utils'
import DeviceWearerResponsibleAdultService from '../services/deviceWearerResponsibleAdultService'

const DeviceWearerResponsibleAdultFormDataModel = z.object({
  action: z.string(),
  relationship: z.string(),
  otherRelationshipDetails: z.string(),
  fullName: z.string(),
  contactNumber: z.string(),
})

type DeviceWearerResponsibleAdultFormData = z.infer<typeof DeviceWearerResponsibleAdultFormDataModel>

type DeviceWearerResponsibleAdultViewModel = {
  formActionUri: string
  orderSummaryUri: string
  relationship: TextField
  otherRelationshipDetails: TextField
  fullName: TextField
  contactNumber: TextField
}

export default class DeviceWearerResponsibleAdultController {
  constructor(
    private readonly auditService: AuditService,
    private readonly deviceWearerResponsibleAdultService: DeviceWearerResponsibleAdultService,
  ) {}

  private createViewModelFromFormData(
    formData: DeviceWearerResponsibleAdultFormData,
    validationErrors: ValidationResult,
    orderId: string,
  ): DeviceWearerResponsibleAdultViewModel {
    return {
      formActionUri: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId),
      orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
      relationship: {
        value: formData.relationship || '',
        error: getError(validationErrors, 'relationship'),
      },
      otherRelationshipDetails: {
        value: formData.otherRelationshipDetails || '',
        error: getError(validationErrors, 'otherRelationshipDetails'),
      },
      fullName: { value: formData.fullName || '', error: getError(validationErrors, 'fullName') },
      contactNumber: { value: formData.contactNumber || '', error: getError(validationErrors, 'contactNumber') },
    }
  }

  private createViewModelFromDeviceWearerResponsibleAdult(
    deviceWearerResponsibleAdult: DeviceWearerResponsibleAdult,
    orderId: string,
  ): DeviceWearerResponsibleAdultViewModel {
    return {
      formActionUri: paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId),
      orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
      relationship: { value: deviceWearerResponsibleAdult.relationship || '' },
      otherRelationshipDetails: { value: deviceWearerResponsibleAdult.otherRelationshipDetails || '' },
      fullName: { value: deviceWearerResponsibleAdult.fullName || '' },
      contactNumber: { value: deviceWearerResponsibleAdult!.contactNumber || '' },
    }
  }

  private constructViewModel(
    deviceWearerResponsibleAdult: DeviceWearerResponsibleAdult,
    validationErrors: ValidationResult,
    formData: [DeviceWearerResponsibleAdultFormData],
    formAction: string,
  ): DeviceWearerResponsibleAdultViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return this.createViewModelFromFormData(formData[0], validationErrors, formAction)
    }
    return this.createViewModelFromDeviceWearerResponsibleAdult(deviceWearerResponsibleAdult, formAction)
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearerResponsibleAdult } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(
      deviceWearerResponsibleAdult ?? {
        relationship: null,
        otherRelationshipDetails: null,
        fullName: null,
        contactNumber: null,
      },
      errors as never,
      formData as never,
      orderId,
    )

    res.render(`pages/order/about-the-device-wearer/responsible-adult-details`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = DeviceWearerResponsibleAdultFormDataModel.parse(req.body)

    const updateDeviceWearerResult = await this.deviceWearerResponsibleAdultService.updateDeviceWearerResponsibleAdult({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(updateDeviceWearerResult)) {
      req.flash('formData', formData)
      req.flash('validationErrors', updateDeviceWearerResult)

      res.redirect(paths.ABOUT_THE_DEVICE_WEARER.RESPONSIBLE_ADULT.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', orderId))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
