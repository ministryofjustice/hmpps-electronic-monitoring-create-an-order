/* eslint max-classes-per-file: ["error", 2] */

import AppPage from './appPage'

export default class ErrorPage extends AppPage {
  constructor(errorMessage: string) {
    super(errorMessage, '/*')
  }
}

export class NotFoundErrorPage extends AppPage {
  constructor() {
    super('Not Found', '/*')
  }
}
