// The label component as described at https://design-system.service.gov.uk/components/label.
export type Label = {
  /*
      If `html` is set, this is not required. Text to use within the label. If `html` is provided, the `text` argument will be ignored.
    */
  text?: string

  /*
      If `text` is set, this is not required. HTML to use within the label. If `html` is provided, the `text` argument will be ignored.
    */
  html?: string

  /*
      The value of the for attribute, the id of the input the label is associated with.
    */
  for?: string

  /*
      Whether the label also acts as the heading for the page.
    */
  isPageHeading?: boolean

  /*
      Classes to add to the label tag.
    */
  classes?: string

  /*
      HTML attributes (for example data attributes) to add to the label tag.
    */
  attributes?: Record<string, unknown>
}
