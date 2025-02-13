import { ErrorMessage } from './errorMessage'
import { Hint } from './hint'
import { Label } from './label'

// The input component as described at https://design-system.service.gov.uk/components/input.
export type Input = {
  /*
    The id of the input.
  */
  id: string

  /*
    The name of the input, which is submitted with the form data.
  */
  name: string

  /*
    Type of input control to render. Defaults to "text".
  */
  type?: string

  /*
    Optional value for [inputmode](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode).
  */
  inputmode?: string

  /*
    Optional initial value of the input.
  */
  value?: string

  /*
    If `true`, input will be disabled.
  */
  disabled?: boolean

  /*
    One or more element IDs to add to the `aria-describedby` attribute, used to provide additional descriptive information for screenreader users.
  */
  describedBy?: string

  /*
    Options for the label component.
  */
  label: Label

  /*
    Options for the hint component.
  */
  hint?: Hint

  /*
    Options for the error message component. The error message component will not display if you use a falsy value for `errorMessage`, for example `false` or `null`.
  */
  errorMessage?: ErrorMessage

  /*
      Options for the prefix element.
    */
  prefix?: {
    /*
      Required. If `html` is set, this is not required. Text to use within the label. If `html` is provided, the `text` argument will be ignored.
    */
    text?: string

    /*
      Required. If `text` is set, this is not required. HTML to use within the label. If `html` is provided, the `text` argument will be ignored.
    */
    html?: string

    /*
      Classes to add to the prefix.
    */
    classes?: string

    /*
      HTML attributes (for example data attributes) to add to the prefix element.
    */
    attributes?: Record<string, unknown>
  }

  /*
    Options for the suffix element.
  */
  suffix?: {
    /*
      Required. If `html` is set, this is not required. Text to use within the label. If `html` is provided, the `text` argument will be ignored.
    */
    text?: string

    /*
      Required. If `text` is set, this is not required. HTML to use within the label. If `html` is provided, the `text` argument will be ignored.
    */
    html?: string

    /*
      Classes to add to the suffix element.
    */
    classes?: string

    /*
      HTML attributes (for example data attributes) to add to the suffix element.
    */
    attributes?: Record<string, unknown>
  }

  /*
    Options for the form-group wrapper
  */
  formGroup?: {
    /*
      Classes to add to the form group (e.g. to show error state for the whole group)
    */
    classes?: string
  }

  /*
    Classes to add to the input.
  */
  classes?: string

  /*
    Attribute to [identify input purpose](https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html), for instance "postal-code" or "username". See [autofill](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill) for full list of attributes that can be used.
  */
  autocomplete?: string

  /*
    Attribute to [provide a regular expression pattern](https://www.w3.org/TR/html51/sec-forms.html#the-pattern-attribute), used to match allowed character combinations for the input value.
  */
  pattern?: string

  /*
    Optional field to enable or disable the spellcheck attribute on the input.
  */
  spellcheck?: boolean

  /*
    HTML attributes (for example data attributes) to add to the anchor tag.
  */
  attributes?: Record<string, unknown>
}
