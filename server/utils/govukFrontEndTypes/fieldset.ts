// The fieldset component as described at https://design-system.service.gov.uk/components/fieldset.
export type Fieldset = {
  /*
      One or more element IDs to add to the `aria-describedby` attribute, used to provide additional descriptive information for screenreader users.
    */
  describedBy?: string

  /*
      Options for the legend
    */
  legend?: FieldsetLegend

  /*
      Classes to add to the fieldset container.
    */
  classes?: string

  /*
      Optional ARIA role attribute.
    */
  role?: string

  /*
      HTML attributes (for example data attributes) to add to the fieldset container.
    */
  attributes?: Record<string, unknown>

  /*
      HTML to use/render within the fieldset element.
    */
  html?: string

  /*
      Not strictly a parameter but [Nunjucks code convention](https://mozilla.github.io/nunjucks/templating.html#call). Using a `call` block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire fielset component in a `call` block.
    */
  caller?: unknown // nunjucks-block
}

export interface FieldsetLegend {
  /*
      If `html` is set, this is not required. Text to use within the legend. If `html` is provided, the `text` argument will be ignored.
    */
  text?: string

  /*
      If `text` is set, this is not required. HTML to use within the legend. If `html` is provided, the `text` argument will be ignored.
    */
  html?: string

  /*
      Classes to add to the legend.
    */
  classes?: string

  /*
      Whether the legend also acts as the heading for the page.
    */
  isPageHeading?: boolean
}
