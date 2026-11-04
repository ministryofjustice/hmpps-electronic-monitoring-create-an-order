import { Hint } from './hint'
import { Label } from './label'

// The radios component as described at https://design-system.service.gov.uk/components/radios.
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
  checked?: boolean | null

  /*
      Provide additional content to reveal when the checkbox is checked.
    */
  conditional?: RadiosItemConditional

  /*
      If true, radio will be disabled.
    */
  disabled?: boolean

  /*
      HTML attributes (for example data attributes) to add to the radio input tag.
    */
  attributes?: Record<string, unknown>
}

export type RadiosItemConditional = {
  /*
      Provide content for the conditional reveal.
    */
  html?: string
}
