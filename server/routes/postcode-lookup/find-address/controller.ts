import { Request, RequestHandler, Response } from 'express'
import paths from '../../../constants/paths'

export default class FindAddressController {
  constructor() {}

  view: RequestHandler = async (req: Request, res: Response) => {
    res.render('pages/WIP', {
      pageName: 'Find Address',
      items: [
        {
          value: 'Search',
          text: 'Search',
        },
        {
          value: 'Manual',
          text: 'Manual',
        },
      ],
      errorSummary: null,
    })
  }

  update: RequestHandler = async (req: Request, res: Response) => {
    const order = req.order!
    const formData = req.body
    const { addressType } = req.params
    if (formData.branch === 'Search')
      res.redirect(
        paths.POSTCODE_LOOKUP.ADDRESS_RESULT.replace(':orderId', order.id).replace(':addressType', addressType),
      )
    else if (formData.branch === 'Manual')
      res.redirect(
        paths.POSTCODE_LOOKUP.ENTER_ADDRESS.replace(':orderId', order.id).replace(':addressType', addressType),
      )
  }
}
