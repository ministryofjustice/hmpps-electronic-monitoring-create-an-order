import { ErrorMessage } from './errorMessage'
import { Fieldset } from './fieldset'
import { Hint } from './hint'
import { Label } from './label'

// The radios component as described at https://design-system.service.gov.uk/components/radios.
export type Radios = {
  /*
    Options for the fieldset component (e.g. legend).
  */
  fieldset?: Fieldset

  /*
    Options for the hint component (e.g. text).
  */
  hint?: Hint

  /*
    Options for the error message component. The error message component will not display if you use a falsy value for `errorMessage`, for example `false` or `null`.
  */
  errorMessage?: ErrorMessage

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
    String to prefix id for each radio item if no id is specified on each item. If `idPrefix` is not passed, fallback to using the name attribute instead.
  */
  idPrefix?: string

  /*
    Name attribute for each radio item.
  */
  name: string

  /*
    Array of radio items objects.
  */
  items: Array<RadiosItem>

  /*
    Classes to add to the radio container.
  */
  classes?: string

  /*
    HTML attributes (for example data attributes) to add to the radio input tag.
  */
  attributes?: Record<string, unknown>
}

export type RadiosItem = {
  /*
    If `html` is set, this is not required. Text to use within each radio item label. If `html` is provided, the `text` argument will be ignored.
  */
  text?: string

  /*
    If `text` is set, this is not required. HTML to use within each radio item label. If `html` is provided, the `text` argument will be ignored.
  */
  html?: string

  /*
    Specific id attribute for the radio item. If omitted, then `idPrefix` string will be applied.
  */
  id?: string

  /*
    Value for the radio input.
  */
  value: string

  /*
    Provide attributes and classes to each radio item label.
  */
  label?: Label

  /*
    Provide hint to each radio item.
  */
  hint?: Hint

  /*
    Divider text to separate radio items, for example the text "or".
  */
  divider?: string

  /*
    If true, radio will be checked.
  */
  checked?: boolean

  /*
    Provide additional content to reveal when the radio is checked.
  */
  conditional?: {
    /*
      Provide content for the conditional reveal.
    */
    html?: string
  }

  /*
    If true, radio will be disabled.
  */
  disabled?: boolean

  /*
    HTML attributes (for example data attributes) to add to the radio input tag.
  */
  attributes?: Record<string, unknown>
}
