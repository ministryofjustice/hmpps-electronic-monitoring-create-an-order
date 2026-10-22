// The hint component is described at https://design-system.service.gov.uk/components/hint.
export type Hint = {
  /*
      If `html` is set, this is not required. Text to use within the hint. If `html` is provided, the `text` argument will be ignored.
    */
  text?: string

  /*
      If `text` is set, this is not required. HTML to use within the hint. If `html` is provided, the `text` argument will be ignored.
    */
  html?: string

  /*
      Optional id attribute to add to the hint span tag.
    */
  id?: string

  /*
      Classes to add to the hint span tag.
    */
  classes?: string

  /*
      HTML attributes (for example data attributes) to add to the hint span tag.
    */
  attributes?: Record<string, unknown>
}
