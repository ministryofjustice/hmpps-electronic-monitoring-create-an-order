import Page from './page'
import PageHeaderComponent from './components/PageHeaderComponent'

export default class AppPage extends Page {
  header: PageHeaderComponent

  constructor(title: string, subtitle?: string) {
    super(title, subtitle)
    this.header = new PageHeaderComponent()
  }
}
