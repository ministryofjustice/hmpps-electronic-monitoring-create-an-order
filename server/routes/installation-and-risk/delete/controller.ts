import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'
import ViewModel from './viewModel'
import OffenceService from '../offence/service'
import DapoService from '../dapo/service'

export default class OffenceListDeleteController {
  constructor(
    private readonly offenceService: OffenceService,
    private readonly dapoService: DapoService,
  ) {}

  view: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const id = req.params.offenceId

    res.render('pages/order/installation-and-risk/offence/delete', ViewModel.construct(order, id, res.locals.content!))
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const id = req.params.offenceId
    const accessToken = res.locals.user.token

    if (req.body.action === 'cancel') {
      return res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
    }

    const matchingOffence = order.offences.find(offence => offence.id === id)
    const matchingClause = order.dapoClauses.find(clause => clause.id === id)

    if (matchingOffence) {
      await this.offenceService.deleteOffence({
        accessToken,
        orderId: order.id,
        offenceId: id,
      })
      if (order.offences.length === 1) {
        return res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_NEW_ITEM.replace(':orderId', order.id))
      }
    } else if (matchingClause) {
      await this.dapoService.deleteDapo({
        accessToken,
        orderId: order.id,
        clauseId: id,
      })
      if (order.dapoClauses.length === 1) {
        return res.redirect(paths.INSTALLATION_AND_RISK.DAPO_ID.replace(':orderId', order.id))
      }
    }

    return res.redirect(paths.INSTALLATION_AND_RISK.OFFENCE_LIST.replace(':orderId', order.id))
  }
}
