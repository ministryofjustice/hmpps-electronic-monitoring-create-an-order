import paths from '../../../../server/constants/paths'
import AppPage from '../../../pages/appPage'
import { PageElement } from '../../../pages/page'

export default class SpecialOrderPage extends AppPage {
  constructor(section?: string) {
    super('This is a Special order', paths.ORDER.SPECIAL_ORDER, undefined, undefined, section)
  }

  returnToFormButton = (): PageElement => cy.get('#back-to-order-button')
}
