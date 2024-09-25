import Page from './page'

export default class ErrorPage extends Page {
  constructor(errorMessage: string) {
    super(errorMessage)
  }
}
