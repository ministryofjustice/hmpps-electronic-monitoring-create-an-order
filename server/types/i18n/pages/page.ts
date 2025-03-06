type Question = {
  // The label tells the user what information is required.
  text: string

  // Help text to aid the user in answering the question.
  hint?: string
}

type PageContent<T extends string> = {
  // The section the page belongs to. Used as a subheading.
  section: string

  // The page title
  title: string

  // Describes the group of questions on the page.
  legend: string

  // General help text to aid the user in filling in the form.
  helpText: string

  // Describes the inputs on the page.
  questions: Record<T, Question>
}

export default PageContent
