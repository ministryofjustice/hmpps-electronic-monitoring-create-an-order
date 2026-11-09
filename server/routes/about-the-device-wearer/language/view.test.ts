import express from 'express'
import getContent from '../../../i18n'
import nunjucksSetup from '../../../utils/views/nunjucksSetup'
import viewModel from './viewModel'

const app = express()
nunjucksSetup(app)
const content = getContent('en', 'DDV5')

const render = (locals: Record<string, unknown> = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    app.render(
      'pages/order/about-the-device-wearer/language',
      {
        content,
        ...viewModel.construct({}, content.pages.deviceWearer.languagePage, false),
        isOrderEditable: true,
        ...locals,
      },
      (error, html) => (error ? reject(error) : resolve(html)),
    )
  })

describe('language view', () => {
  it('uses the question as the only H1 and the page title', async () => {
    const html = await render()

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>\s*Is an interpreter needed\?\s*<\/h1>/)
    expect(html).toMatch(/<title>\s*Is an interpreter needed\?/)
  })

  it('labels the existing unknown answer without changing its value', async () => {
    const html = await render()

    expect(html).toContain('value="DONT_KNOW"')
    expect(html).toContain('Not able to provide this information')
    expect(html).not.toContain('Don&#39;t know')
    expect(html).toContain('data-aria-controls=')
    expect(html).toContain('name="language"')
  })

  it('keeps the language conditional selected for a saved yes answer', async () => {
    const html = await render(
      viewModel.construct(
        { interpreterRequired: true, language: 'Arabic' },
        content.pages.deviceWearer.languagePage,
        false,
      ),
    )

    expect(html).toMatch(/value="true" checked/)
    expect(html).toContain('value="Arabic" selected')
  })
})
