type ConfirmationPageContent = {
  // The page title
  title: string

  // Describes the group of questions on the page.
  heading: string

  // General help text to aid the user in filling in the form.
  helpText?: string | string[]

  // Describes the inputs on the page.
  buttons?: {
    [key: string]: string
  }
}

export default ConfirmationPageContent
