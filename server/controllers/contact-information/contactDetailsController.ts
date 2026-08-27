import { Request, RequestHandler, Response } from 'express'
import paths from '../../constants/paths'
import { ContactDetailsService } from '../../services'
import { isValidationResult } from '../../models/Validation'
import contactDetailsViewModel from '../../models/view-models/contactDetails'
import ContactDetailsFormDataModel from '../../models/form-data/contactDetails'
import TaskListService from '../../services/taskListService'
import CorePersonRecordService from '../../routes/postcode-lookup/core-person-record/service'

export default class ContactDetailsController {
  constructor(
    private readonly contactDetailsService: ContactDetailsService,
    private readonly taskListService: TaskListService,
    private readonly corePersonRecordService: CorePersonRecordService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const { contactDetails } = req.order!
    const errors = req.flash('validationErrors')
    const formData = req.flash('formData')
    const viewModel = contactDetailsViewModel.construct(contactDetails, formData[0] as never, errors as never)

    res.render('pages/order/contact-information/contact-details', viewModel)
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string
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
      const primaryAddress = req.order!.addresses.find(address => address.addressType === 'PRIMARY')
      const confirmAddressPath = paths.POSTCODE_LOOKUP.CONFIRM_ADDRESS.replace(':orderId', orderId).replace(
        ':addressType',
        'PRIMARY',
      )

      if (primaryAddress) {
        res.redirect(confirmAddressPath)
        return
      }

      const organisationSearchId = this.corePersonRecordService.getOrganisationSearchId(req.order!)

      if (organisationSearchId) {
        res.redirect(`${confirmAddressPath}?organisationSearchId=${encodeURIComponent(organisationSearchId)}`)
        return
      }

      res.redirect(this.taskListService.getNextPage('CONTACT_DETAILS', req.order!))
    } else {
      res.redirect(paths.ORDER.SUMMARY.replace(':orderId', orderId))
    }
  }
}
