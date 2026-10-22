// The error summary component as described at https://design-system.service.gov.uk/components/error-summary.
export type ErrorSummary = {
  /*
      If `titleHtml` is set, this is not required. Text to use for the heading of the error summary block. If `titleHtml` is provided, `titleText` will be ignored.
    */
  titleText?: string

  /*
      If `titleText` is set, this is not required. HTML to use for the heading of the error summary block. If `titleHtml` is provided, `titleText` will be ignored.
    */
  titleHtml?: string

  /*
      Text to use for the description of the errors. If you set `descriptionHtml`, the component will ignore `descriptionText`.
    */
  descriptionText?: string

  /*
      HTML to use for the description of the errors. If you set this option, the component will ignore `descriptionText`.
    */
  descriptionHtml?: string

  /*
      Contains an array of error link items and all their available arguments.
    */
  errorList: Array<ErrorListItem>

  /*
      Classes to add to the error-summary container.
    */
  classes?: string

  /*
      HTML attributes (for example data attributes) to add to the error-summary container.
    */
  attributes?: Record<string, unknown>
}

export type ErrorListItem = {
  /*
      Href attribute for the error link item. If provided item will be an anchor.
    */
  href?: string

  /*
      If `html` is set, this is not required. Text for the error link item. If `html` is provided, the `text` option will be ignored.
    */
  text?: string

  /*
      If `text` is set, this is not required. HTML for the error link item. If `html` is provided, the `text` option will be ignored.
    */
  html?: string

  /*
      HTML attributes (for example data attributes) to add to the error link anchor.
    */
  attributes?: Record<string, unknown>
}
