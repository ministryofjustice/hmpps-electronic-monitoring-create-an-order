import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { NotifyingOrganisation } from '../../models/NotifyingOrganisation'
import { isValidationResult, ValidationResult } from '../../models/Validation'
import { AddressField, TextField } from '../../models/view-models/utils'
import { AuditService } from '../../services'
import NotifyingOrganisationService from '../../services/notifyingOrganisationService'
import { getError } from '../../utils/utils'
import TaskListService from '../../services/taskListService'

const NotifyingOrganisationFormDataModel = z.object({
  action: z.string(),
  notifyingOrganisationEmail: z.string(),
  officerName: z.string(),
  officerPhoneNumber: z.string(),
  organisationType: z.string().optional(),
  organisationRegion: z.string(),
  organisationAddressLine1: z.string(),
  organisationAddressLine2: z.string(),
  organisationAddressLine3: z.string(),
  organisationAddressLine4: z.string(),
  organisationAddressPostcode: z.string(),
  organisationPhoneNumber: z.string(),
  organisationEmail: z.string(),
})

type NotifyingOrganisationFormData = z.infer<typeof NotifyingOrganisationFormDataModel>

type NotifyingOrganisationViewModel = {
  notifyingOrganisationEmail: TextField
  officerName: TextField
  officerPhoneNumber: TextField
  organisationType: TextField
  organisationRegion: TextField
  organisationAddress: AddressField
  organisationPhoneNumber: TextField
  organisationEmail: TextField
}

export default class NotifyingOrganisationController {
  constructor(
    private readonly auditService: AuditService,
    private readonly notifyingOrganisationService: NotifyingOrganisationService,
    private readonly taskListService: TaskListService,
  ) {}

  private constructViewModel(
    alcoholMonitoring: NotifyingOrganisation | undefined,
    formData: NotifyingOrganisationFormData,
    validationErrors: ValidationResult,
  ): NotifyingOrganisationViewModel {
    if (validationErrors.length > 0) {
      return this.createViewModelFromFormData(formData, validationErrors)
    }

    return this.createViewModelFromApiModel(alcoholMonitoring)
  }

  private createViewModelFromApiModel(notifyingOrganisation?: NotifyingOrganisation): NotifyingOrganisationViewModel {
    return {
      notifyingOrganisationEmail: { value: notifyingOrganisation?.notifyingOrganisationEmail ?? '' },
      officerName: { value: notifyingOrganisation?.officerName ?? '' },
      officerPhoneNumber: { value: notifyingOrganisation?.officerPhoneNumber ?? '' },
      organisationType: { value: notifyingOrganisation?.organisationType ?? '' },
      organisationRegion: { value: notifyingOrganisation?.organisationRegion ?? '' },
      organisationAddress: {
        value: {
          line1: notifyingOrganisation?.organisationAddressLine1 ?? '',
          line2: notifyingOrganisation?.organisationAddressLine2 ?? '',
          line3: notifyingOrganisation?.organisationAddressLine3 ?? '',
          line4: notifyingOrganisation?.organisationAddressLine4 ?? '',
          postcode: notifyingOrganisation?.organisationAddressPostcode ?? '',
        },
      },
      organisationPhoneNumber: { value: notifyingOrganisation?.organisationPhoneNumber ?? '' },
      organisationEmail: { value: notifyingOrganisation?.organisationEmail ?? '' },
    }
  }

  private createViewModelFromFormData(
    formData: NotifyingOrganisationFormData,
    validationErrors: ValidationResult,
  ): NotifyingOrganisationViewModel {
    return {
      notifyingOrganisationEmail: {
        value: formData.notifyingOrganisationEmail ?? '',
        error: getError(validationErrors, 'notifyingOrganisationEmail'),
      },
      officerName: { value: formData.officerName ?? '', error: getError(validationErrors, 'officerName') },
      officerPhoneNumber: {
        value: formData.officerPhoneNumber ?? '',
        error: getError(validationErrors, 'officerPhoneNumber'),
      },
      organisationType: {
        value: formData.organisationType ?? '',
        error: getError(validationErrors, 'organisationType'),
      },
      organisationRegion: {
        value: formData.organisationRegion ?? '',
        error: getError(validationErrors, 'organisationRegion'),
      },
      organisationAddress: {
        value: {
          line1: formData.organisationAddressLine1 ?? '',
          line2: formData.organisationAddressLine2 ?? '',
          line3: formData.organisationAddressLine3 ?? '',
          line4: formData.organisationAddressLine4 ?? '',
          postcode: formData.organisationAddressPostcode ?? '',
        },
        error: getError(validationErrors, 'organisationAddress'),
      },
      organisationPhoneNumber: {
        value: formData.organisationPhoneNumber ?? '',
        error: getError(validationErrors, 'organisationPhoneNumber'),
      },
      organisationEmail: {
        value: formData.organisationEmail ?? '',
        error: getError(validationErrors, 'organisationEmail'),
      },
    }
  }

  private createApiModelFromFormData(formData: NotifyingOrganisationFormData): NotifyingOrganisation {
    return {
      notifyingOrganisationEmail: formData.notifyingOrganisationEmail,
      officerName: formData.officerName,
      officerPhoneNumber: formData.officerPhoneNumber,
      organisationType: formData.organisationType ?? null,
      organisationRegion: formData.organisationRegion,
      organisationAddressLine1: formData.organisationAddressLine1,
      organisationAddressLine2: formData.organisationAddressLine2,
      organisationAddressLine3: formData.organisationAddressLine3,
      organisationAddressLine4: formData.organisationAddressLine4,
      organisationAddressPostcode: formData.organisationAddressPostcode,
      organisationPhoneNumber: formData.organisationPhoneNumber,
      organisationEmail: formData.organisationEmail,
    }
  }

  view: RequestHandler = async (req: Request, res: Response) => {
    const { notifyingOrganisation } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = this.constructViewModel(notifyingOrganisation, formData as never, errors as never)

    res.render('pages/order/contact-information/notifying-organisation', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const formData = NotifyingOrganisationFormDataModel.parse(req.body)
    const data = this.createApiModelFromFormData(formData)

    const result = await this.notifyingOrganisationService.update({
      accessToken: res.locals.user.token,
      orderId,
      data,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.CONTACT_INFORMATION.NOTIFYING_ORGANISATION.replace(':orderId', orderId))
    } else if (formData.action === 'continue') {
      res.redirect(this.taskListService.getNextPage('NOTIFYING_ORGANISATION', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
