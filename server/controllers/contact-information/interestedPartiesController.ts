import { Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import paths from '../../constants/paths'
import { isValidationResult } from '../../models/Validation'
import { AuditService } from '../../services'
import InterestedPartiesService from '../../services/interestedPartiesService'
import { getErrorsViewModel } from '../../utils/utils'
import TaskListService from '../../services/taskListService'

const FormDataModel = z.object({
  action: z.string().default('continue'),
  notifyingOrganisationEmail: z.string(),
  responsibleOfficerName: z.string(),
  responsibleOfficerPhoneNumber: z.string(),
  responsibleOrganisation: z.string().default(''),
  responsibleOrganisationRegion: z.string(),
  responsibleOrganisationAddressLine1: z.string(),
  responsibleOrganisationAddressLine2: z.string(),
  responsibleOrganisationAddressLine3: z.string(),
  responsibleOrganisationAddressLine4: z.string(),
  responsibleOrganisationAddressPostcode: z.string(),
  responsibleOrganisationPhoneNumber: z.string(),
  responsibleOrganisationEmail: z.string(),
})

export default class InterestedPartiesController {
  constructor(
    private readonly auditService: AuditService,
    private readonly interestedPartiesService: InterestedPartiesService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { interestedParties } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')

    res.render('pages/order/contact-information/interested-parties', {
      ...interestedParties,
      ...(formData.length > 0 ? (formData[0] as never) : {}),
      errors: getErrorsViewModel(errors as never),
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = FormDataModel.parse(req.body)

    const result = await this.interestedPartiesService.update({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.CONTACT_INFORMATION.INTERESTED_PARTIES.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('INTERESTED_PARTIES', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
