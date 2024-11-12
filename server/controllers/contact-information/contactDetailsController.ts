import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { AuditService, ContactDetailsService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import contactDetailsViewModel from '../../models/view-models/contactDetails'
import ContactDetailsFormDataModel from '../../models/form-data/contactDetails'
import TaskListService from '../../services/taskListService'

export default class ContactDetailsController {
  constructor(
    private readonly auditService: AuditService,
    private readonly contactDetailsService: ContactDetailsService,
    private readonly taskListService: TaskListService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { contactDetails } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = contactDetailsViewModel.construct(contactDetails, formData[0] as never, errors as never)

    res.render('pages/order/contact-information/contact-details', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const { orderId } = req.params
    const { action, ...formData } = ContactDetailsFormDataModel.parse(req.body)

    const result = await this.contactDetailsService.updateContactDetails({
      accessToken: res.locals.user.token,
      orderId,
      data: formData,
    })

    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)

      res.redirect(paths.CONTACT_INFORMATION.CONTACT_DETAILS.replace(':orderId', orderId))
    } else if (action === 'continue') {
      res.redirect(this.taskListService.getNextPage('CONTACT_DETAILS', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
