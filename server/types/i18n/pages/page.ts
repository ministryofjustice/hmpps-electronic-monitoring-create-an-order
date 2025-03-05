type Question = {
  text: string
  hint?: string
}

type PageContent<T extends string> = {
  section: string
  title: string

  questions: Record<T, Question>
}

export default PageContent
