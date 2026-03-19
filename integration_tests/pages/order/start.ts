import FormListComponent from '../components/formListComponent'
import Page, { PageElement } from '../page'

export default class StartPage extends Page {
  constructor() {
    super('Apply, change or end an Electronic Monitoring Order (EMO)', '/')
  }

  signInButton = (): PageElement => cy.get('#sign-in-button')

  public get useServiceList(): FormListComponent {
    return new FormListComponent('#use-service-list')
  }

  public get noAccountList(): FormListComponent {
    return new FormListComponent('#no-account-list')
  }

  public get restrictionsList(): FormListComponent {
    return new FormListComponent('#restrictions-list')
  }

  public get notificationDropdown(): FormListComponent {
    return new FormListComponent('#notification-dropdown')
  }

  public get specialOrdeList(): FormListComponent {
    return new FormListComponent('#specialOrderList')
  }
}
