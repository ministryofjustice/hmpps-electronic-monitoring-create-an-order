import express from 'express'
import getContent from '../../../i18n'
import { Locales } from '../../../types/i18n/locale'
import nunjucksSetup from '../../../utils/views/nunjucksSetup'
import viewModel from './viewModel'

const VIEW = 'pages/order/about-the-device-wearer/device-wearer-details'

const app = express()
nunjucksSetup(app)

const render = (locals: Record<string, unknown>): Promise<string> =>
  new Promise((resolve, reject) => {
    app.render(VIEW, { content: getContent(Locales.en, 'DDV4'), ...locals }, (err, html) =>
      err ? reject(err) : resolve(html),
    )
  })

const fieldset = (html: string, name: string): string => {
  const start = html.indexOf(`name="${name}"`)
  const fieldsetStart = html.lastIndexOf('<fieldset', start)
  return html.slice(fieldsetStart, html.indexOf('</fieldset>', start))
}

describe('device wearer details view', () => {
  const blank = viewModel.construct({}, undefined, [])

  it('asks only the personal details questions', async () => {
    const html = await render({ ...blank, isOrderEditable: true })

    expect(html).toContain('Personal details')
    ;['firstName', 'middleName', 'lastName', 'alias', 'dateOfBirth[day]', 'sex', 'gender'].forEach(name =>
      expect(html).toContain(`name="${name}"`),
    )
    ;['disabilities', 'otherDisability', 'interpreterRequired', 'language', 'adultAtTimeOfInstallation'].forEach(name =>
      expect(html).not.toContain(`name="${name}"`),
    )
    expect(html).not.toContain('Does the device wearer have any of the disabilities or health conditions listed?')
  })

  it('is a single question page with a Continue button and no save as draft', async () => {
    const html = await render({ ...blank, isOrderEditable: true })

    expect(html).toMatch(/<button[^>]*value="continue"[^>]*>\s*Continue\s*<\/button>/)
    expect(html).toMatch(/<button[^>]*name="action"[^>]*>\s*Continue\s*<\/button>/)
    expect(html).not.toContain('Save and continue')
    expect(html).not.toContain('Save as draft')
  })

  it('takes the heading and date of birth hint from content', async () => {
    const content = getContent(Locales.en, 'DDV4')
    const html = await render({
      ...blank,
      isOrderEditable: true,
      content: {
        ...content,
        pages: {
          ...content.pages,
          deviceWearer: {
            ...content.pages.deviceWearer,
            title: 'Heading from content',
            questions: {
              ...content.pages.deviceWearer.questions,
              dateOfBirth: { text: 'Date of birth question', hint: 'Date of birth hint from content' },
            },
          },
        },
      },
    })

    expect(html).toMatch(/<h1[^>]*>[\s\S]*Heading from content[\s\S]*<\/h1>/)
    expect(html).toContain('Date of birth hint from content')
  })

  it('selects no sex option for a legacy "Prefer not to say" answer', async () => {
    const model = viewModel.construct({ sex: 'PREFER_NOT_TO_SAY' }, undefined, [])
    const sex = fieldset(await render({ ...model, isOrderEditable: true }), 'sex')

    expect(sex).not.toContain('checked')
  })

  it('does not offer "Prefer not to say" for sex and separates the last option with "or"', async () => {
    const sex = fieldset(await render({ ...blank, isOrderEditable: true }), 'sex')

    expect(sex).not.toContain('Prefer not to say')
    expect(sex).not.toContain('value="PREFER_NOT_TO_SAY"')
    expect(sex).toMatch(/value="FEMALE"[\s\S]*govuk-radios__divider">or<[\s\S]*value="UNKNOWN"/)
  })

  it('separates "Not able to provide this information" for gender with "or"', async () => {
    const gender = fieldset(await render({ ...blank, isOrderEditable: true }), 'gender')

    expect(gender).toMatch(
      /value="PREFER_TO_SELF_DESCRIBE"[\s\S]*govuk-radios__divider">or<[\s\S]*value="NOT_ABLE_TO_PROVIDE_THIS_INFORMATION"/,
    )
  })

  it('links errors to their fields', async () => {
    const model = viewModel.construct({}, { ...blankFormData, sex: '' }, [
      { field: 'sex', error: "Select the device wearer's sex, or select 'Not able to provide this information'" },
    ])
    const html = await render({ ...model, isOrderEditable: true })

    expect(html).toContain('href="#sex"')
    expect(fieldset(html, 'sex')).toContain('govuk-error-message')
  })

  it('is read-only when the order cannot be edited, like other single question pages', async () => {
    const model = viewModel.construct({ firstName: 'Jane', sex: 'FEMALE', gender: 'MALE' }, undefined, [])
    const html = await render({ ...model, isOrderEditable: false })

    expect(html).toMatch(/id="firstName" name="firstName" type="text" value="Jane" disabled/)
    expect(fieldset(html, 'sex')).toMatch(/value="FEMALE" checked disabled/)
    expect(html).not.toContain('Save as draft')
  })
})

const blankFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
  alias: '',
  dateOfBirth: { day: '', month: '', year: '' },
  sex: '',
  gender: '',
}
