import { Response, Request } from 'express'
import Address from './Address'
import AddressSearch from './AddressSearch'

export default class PostCodeSearchController {
  constructor(private readonly addressSearch: AddressSearch) {}

  view = async (req: Request, res: Response) => {
    const postcode = req.flash('postcode')

    const results = await this.addressSearch.search(postcode[0])

    const model = this.model(results)

    res.render('pages/order/postcode', model)
  }

  update = async (req: Request, res: Response) => {
    req.flash('postcode', req.body.postcode)
    res.redirect('/postcode')
  }

  private model(addresses: Address[]) {
    return {
      list: addresses.map(a => {
        return {
          value: a.displayText(),
          text: a.displayText(),
        }
      }),
    }
  }
}
