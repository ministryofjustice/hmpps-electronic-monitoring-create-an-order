import Component from '../components/component'
import Page from '../pages/page'
import PageRenderer from './page'

// TODO - disabled
class DeviceWearerNamesPageRenderer extends PageRenderer {
  renderAlias(alias: Component) {
    return {
      type: 'govukRadios',
      args: {
        label: {
          text: 'Does the device wearer have a preferred name that is different to their first name?',
        },
        id: 'aliasFilter',
        name: 'aliasFilter',
        value: null,
        items: [
          {
            conditional: this.renderComponent(alias),
            value: 'YES',
            text: 'Yes',
            disabled: false,
          },
          {
            value: 'NO',
            text: 'No',
            disabled: false,
          },
          {
            divider: 'or',
          },
          {
            value: 'UNKNOWN',
            text: 'Not able to provide this information',
            disabled: false,
          },
        ],
      },
    }
  }

  render(page: Page): any {
    return {
      title: page.title,
      subtitle: page.subtitle,
      errorSummary: this.getErrorSummary(page),
      fields: [
        this.renderComponent(page.fields[0]),
        this.renderComponent(page.fields[1]),
        this.renderAlias(page.fields[2]),
      ],
    }
  }
}

export default DeviceWearerNamesPageRenderer
