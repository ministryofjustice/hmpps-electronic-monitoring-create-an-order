import { Hint } from './hint'
import { Label } from './label'

// The checkboxes component as described at https://design-system.service.gov.uk/components/checkboxes.
export type CheckboxItem = {
  /*
      If `html` is set, this is not required. Text to use within each checkbox item label. If `html` is provided, the `text` argument will be ignored.
    */
  text?: string

  /*
      If `text` is set, this is not required. HTML to use within each checkbox item label. If `html` is provided, the `text` argument will be ignored.
    */
  html?: string

  /*
      Specific id attribute for the checkbox item. If omitted, then component global `idPrefix` option will be applied.
    */
  id?: string

  /*
      Specific name for the checkbox item. If omitted, then component global `name` string will be applied.
    */
  name?: string

  /*
      Value for the checkbox input.
    */
  value: string

  /*
      Provide attributes and classes to each checkbox item label.
    */
  label?: Label

  /*
      Provide hint to each checkbox item.
    */
  hint?: Hint

  /*
      If true, checkbox will be checked.
    */
  checked?: boolean

  /*
   Provide additional content to reveal when the checkbox is checked.
   */
  conditional?: CheckboxItemConditional

  /*
      If true, checkbox will be disabled.
    */
  disabled?: boolean

  /*
      HTML attributes (for example data attributes) to add to the checkbox input tag.
    */
  attributes?: Record<string, unknown>
}

export type CheckboxItemConditional = {
  /*
      Provide content for the conditional reveal.
    */
  html?: string
}
