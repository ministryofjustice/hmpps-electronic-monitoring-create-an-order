// The error message component as described at https://design-system.service.gov.uk/components/error-message.
export type ErrorMessage = {
  /*
    If `html` is set, this is not required. Text to use within the error message. If `html` is provided, the `text` argument will be ignored.
  */
  text?: string

  /*
    If `text` is set, this is not required. HTML to use within the error message. If `html` is provided, the `text` argument will be ignored.
  */
  html?: string

  /*
    Id attribute to add to the error message span tag.
  */
  id?: string

  /*
    Classes to add to the error message span tag.
  */
  classes?: string

  /*
    HTML attributes (for example data attributes) to add to the error message span tag
  */
  attributes?: Record<string, unknown>

  /*
    A visually hidden prefix used before the error message. Defaults to "Error".
  */
  visuallyHiddenText?: string
}
