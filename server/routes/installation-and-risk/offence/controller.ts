import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import viewModel from './viewModel'
import OffenceFormModel, { OffenceInput } from './formModel'
import OffenceService from './service'
import { ValidationResult, isValidationResult } from '../../../models/Validation'
import { Offence } from '../../../models/Offence'

export default class OffenceController {
  constructor(private readonly service: OffenceService) {}

  courts: (string | null | undefined)[] = [
    'CIVIL_COUNTY_COURT',
    'CROWN_COURT',
    'MAGISTRATES_COURT',
    'MILITARY_COURT',
    'SCOTTISH_COURT',
  ]

  view: RequestHandler = async (req: Request, res: Response) => {
    const { offenceId } = req.params
    const order = req.order!
    const formData = req.flash('formData') as unknown as OffenceInput[]
    const errors = req.flash('validationErrors') as unknown as ValidationResult
    let currentOffence: Offence | undefined
    if (offenceId) {
      currentOffence = req.order!.offences!.find(offence => offence.id === offenceId)
      if (!currentOffence) {
        res.status(404).send(`No matching offence : ${offenceId}`)
        return
      }
    }
    const showDate = this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1

    const isHomeOffice = order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE'

    res.render(
      'pages/order/installation-and-risk/offence/offence',
      viewModel.construct(order, currentOffence, showDate, formData[0], errors, isHomeOffice),
    )
  }

  new: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const showDate = this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1
    const isHomeOffice = order.interestedParties?.notifyingOrganisation === 'HOME_OFFICE'

    res.render(
      'pages/order/installation-and-risk/offence/offence',
      viewModel.construct(order, undefined, showDate, undefined, [], isHomeOffice),
    )
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const { offenceId } = req.params
    req.body.id = offenceId
    const formData = OffenceFormModel.parse(req.body)
    const dateRequired = this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1
    const result = await this.service.updateOffence({
      formData,
      orderId: order.id,
      accessToken: res.locals.user.token,
      dateRequired,
    })
    if (isValidationResult(result)) {
      req.flash('formData', formData)
      req.flash('validationErrors', result)
      if (formData.id) {
        res.redirect(
          paths.INSTALLATION_AND_RISK.OFFENCE.replace(':orderId', order.id).replace(':offenceId', formData.id),
        )
        return
      }
      res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM.replace(':orderId', order.id))
      return
    }
    if (formData.action === 'continue') {
      if (this.courts.indexOf(order.interestedParties?.notifyingOrganisation) !== -1) {
        res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
      } else {
        res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_OTHER_INFO.replace(':orderId', order.id))
      }
    }
  }
}
