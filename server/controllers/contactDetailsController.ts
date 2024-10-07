import { Request, RequestHandler, Response } from 'express'
import z from 'zod'
import paths from '../constants/paths'
import { AuditService, ContactDetailsService } from '../services'
import { ContactDetails } from '../models/ContactDetails'
import { isValidationResult, ValidationResult } from '../models/Validation'

const FormDataModel = z.object({
  action: z.string().default('continue'),
  contactNumber: z.string().transform((val) => val === '' ? null : val),
})

type FormData = z.infer<typeof FormDataModel>

type ViewModel = {
  orderSummaryUri: string
  contactNumber: {
    value: string
    error?: {
      text: string
    }
  }
}

export default class ContactDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly contactDetailsService: ContactDetailsService,
  ) {}

  private constructViewModel(
    contactDetails: ContactDetails,
    validationErrors: ValidationResult,
    formData: [FormData],
    orderId: string,
  ): ViewModel {
    if (validationErrors.length > 0 && formData.length > 0) {
      return {
        orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
        contactNumber: {
          value: formData[0].contactNumber || '',
          error: {
            text: validationErrors[0].error,
          },
        },
      }
    }
    return {
      orderSummaryUri: paths.ORDER.SUMMARY.replace(':orderId', orderId),
      contactNumber: {
        value: contactDetails.contactNumber || '',
      },
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { deviceWearerContactDetails } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(deviceWearerContactDetails, errors as never, formData as never, orderId)

    res.render(`pages/order/contact-information/contact-details`, viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = FormDataModel.parse(req.body)

    const result = await this.contactDetailsService.updateDeviceWearer({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(paths.CONTACT_INFORMATION.ADDRESSES.replace(':orderId', orderId))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
