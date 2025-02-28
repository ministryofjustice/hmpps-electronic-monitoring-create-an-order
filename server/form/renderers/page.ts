import Component from '../components/component'
import DateInput from '../components/date-input'
import Input from '../components/input'
import Radios from '../components/radios'
import RadiosBoolean from '../components/radios-boolean'
import Page from '../pages/page'

// TODO - add disabled to all fields
class PageRenderer {
  protected getErrorMessage(field: string) {
    if (false) {
      return {
        text: '',
      }
    }
    return undefined
  }

  protected getHint(hint?: string) {
    if (hint) {
      return {
        text: hint,
      }
    }
    return undefined
  }

  protected getErrorSummary(page: Page) {
    return {}
  }

  protected renderDateInput(input: DateInput) {
    return {
      type: 'govukDateInput',
      args: {
        errorMessage: this.getErrorMessage(input.id),
        fieldset: {
          legend: {
            text: input.text,
            isPageHeading: false,
            classes: 'govuk-fieldset__legend--m',
          },
        },
        hint: this.getHint(input.hint),
        id: input.id,
        items: [
          {
            classes: 'govuk-input--width-2',
            id: `${input.id}-day`,
            label: 'Day',
            name: `${input.id}[day]`,
            value: input.value.day,
            // TODO - disabled
          },
          {
            classes: 'govuk-input--width-2',
            id: `${input.id}-month`,
            label: 'Month',
            name: `${input.id}[month]`,
            value: input.value.month,
            // TODO - disabled
          },
          {
            classes: 'govuk-input--width-2',
            id: `${input.id}-day`,
            label: 'Year',
            name: `${input.id}[year]`,
            value: input.value.year,
            // TODO - disabled
          },
        ],
      },
    }
  }

  protected renderInput(input: Input) {
    return {
      type: 'govukInput',
      args: {
        classes: 'govuk-input--width-10',
        errorMessage: this.getErrorMessage(input.id),
        hint: this.getHint(input.hint),
        label: {
          text: input.text,
        },
        id: input.id,
        name: input.id,
        value: input.value,
        disabled: input.disabled,
      },
    }
  }

  protected renderRadios(input: Radios) {
    return {
      type: 'govukRadios',
      args: {
        errorMessage: this.getErrorMessage(input.id),
        fieldset: {
          legend: {
            text: input.text,
            isPageHeading: false,
          },
        },
        hint: this.getHint(input.hint),
        id: input.id,
        items: input.options, // TODO - disabled
        name: input.id,
        value: input.value,
      },
    }
  }

  protected renderRadiosBoolean(input: RadiosBoolean) {
    return {
      type: 'govukRadios',
      args: {
        classes: 'govuk-radios--inline',
        errorMessage: this.getErrorMessage(input.id),
        fieldset: {
          legend: {
            text: input.text,
            isPageHeading: false,
          },
        },
        id: input.id,
        items: [
          {
            value: 'true',
            text: 'Yes',
            // TODO - disabled
          },
          {
            value: 'false',
            text: 'No',
            // TODO - disabled
          },
        ],
        name: input.id,
        value: input.value,
      },
    }
  }

  protected renderComponent(component: Component) {
    if (component.type === 'input') {
      return this.renderInput(component)
    }

    if (component.type === 'radios') {
      return this.renderRadios(component)
    }

    if (component.type === 'radios-boolean') {
      return this.renderRadiosBoolean(component)
    }

    if (component.type === 'date-input') {
      return this.renderDateInput(component)
    }

    throw new Error(`Unknown type ${component.type}`)
  }

  render(page: Page) {
    return {
      title: page.title,
      subtitle: page.subtitle,
      errorSummary: this.getErrorSummary(page),
      fields: page.fields.map(field => this.renderComponent(field)),
    }
  }
}

export default PageRenderer
