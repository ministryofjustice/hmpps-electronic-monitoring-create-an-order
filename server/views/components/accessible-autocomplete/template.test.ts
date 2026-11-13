import express from 'express'
import { runInNewContext } from 'node:vm'
import nunjucksSetup from '../../../utils/views/nunjucksSetup'

const app = express()
nunjucksSetup(app)

const render = (params: Record<string, unknown> = {}): Promise<string> =>
  new Promise((resolve, reject) => {
    app.render(
      'components/accessible-autocomplete/template',
      {
        params: {
          id: 'language',
          label: 'Language',
          options: [
            { value: '', text: 'Select' },
            { value: 'Arabic', text: 'Arabic' },
          ],
          ...params,
        },
      },
      (error, html) => (error ? reject(error) : resolve(html)),
    )
  })

describe('accessible autocomplete template', () => {
  it('associates the hint, error and existing descriptions with the control', async () => {
    const html = await render({
      hint: 'Choose a language',
      errorMessage: { text: 'Select the language required' },
      describedBy: 'extra-description',
      nonce: 'test-nonce',
    })

    expect(html).toContain('for="language"')
    expect(html).toContain('id="language-hint"')
    expect(html).toContain('id="language-error"')
    expect(html).toContain('govuk-form-group--error')
    expect(html).toContain('govuk-input--error')
    expect(html).toContain('aria-describedby="extra-description language-hint language-error"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('nonce="test-nonce"')
  })

  it('keeps saved selections, names and the empty instruction', async () => {
    const html = await render({ value: 'Arabic', name: 'preferredLanguage', instruction: 'Choose' })

    expect(html).toContain('name="preferredLanguage"')
    expect(html).toContain('<option value="">Choose</option>')
    expect(html).toContain('<option value="Arabic" selected>Arabic</option>')
    expect(html).toContain('accessibleAutocomplete.enhanceSelectElement')
    expect(html).not.toContain('aria-invalid="true"')
    expect(html).not.toContain('govuk-form-group--error')
    expect(html).not.toContain('aria-describedby="')
  })

  it('uses field-specific hint and error IDs and supports the legacy error parameter', async () => {
    const html = await render({ id: 'organisation', hint: 'Choose an organisation', error: { text: 'Required' } })

    expect(html).toContain('id="organisation-hint"')
    expect(html).toContain('id="organisation-error"')
    expect(html).toContain('aria-describedby="organisation-hint organisation-error"')
    expect(html).not.toContain('id="language-hint"')
  })

  it('renders a disabled native select without enhancement for read-only answers', async () => {
    const html = await render({ disabled: true, value: 'Arabic', hint: 'Choose a language' })

    expect(html).toMatch(/<select[^>]*id="language"[^>]*class="govuk-select" disabled/)
    expect(html).toContain('aria-describedby="language-hint"')
    expect(html).toContain('<option value="Arabic" selected>Arabic</option>')
    expect(html).not.toContain('<script')
    expect(html).not.toContain('enhanceSelectElement')
  })

  it('restores visible input descriptions after library rerenders without an observer loop', async () => {
    const html = await render({ hint: 'Choose a language', errorMessage: { text: 'Required' } })
    const attributes = new Map<string, string>([['aria-describedby', 'language__assistiveHint']])
    const input = {
      getAttribute: (name: string) => attributes.get(name) ?? null,
      setAttribute: jest.fn((name: string, value: string) => attributes.set(name, value)),
    }
    const select = {
      hasAttribute: (name: string) => name === 'aria-invalid',
      getAttribute: (name: string) => (name === 'aria-invalid' ? 'true' : 'language-hint language-error'),
    }
    const getElementById = jest.fn().mockReturnValueOnce(select).mockReturnValue(input)
    const observe = jest.fn()
    let updateDescription: () => void = () => {}
    const MutationObserver = jest.fn((callback: () => void) => {
      updateDescription = callback
      return { observe }
    })
    const enhanceSelectElement = jest.fn()
    const script = html.match(/<script nonce="[^"]*">([\s\S]*?)<\/script>/)?.[1]

    expect(script).toBeDefined()
    runInNewContext(script!, {
      document: { getElementById },
      accessibleAutocomplete: { enhanceSelectElement },
      MutationObserver,
    })

    expect(enhanceSelectElement).toHaveBeenCalledWith(
      expect.objectContaining({ selectElement: select, id: 'language' }),
    )
    expect(attributes.get('aria-invalid')).toBe('true')
    expect(attributes.get('aria-describedby')).toBe('language__assistiveHint language-hint language-error')
    expect(observe).toHaveBeenCalledWith(input, { attributes: true, attributeFilter: ['aria-describedby'] })

    attributes.delete('aria-describedby')
    updateDescription()
    expect(attributes.get('aria-describedby')).toBe('language-hint language-error')

    attributes.set('aria-describedby', 'language__assistiveHint')
    updateDescription()
    expect(attributes.get('aria-describedby')).toBe('language__assistiveHint language-hint language-error')

    input.setAttribute.mockClear()
    updateDescription()
    expect(input.setAttribute).not.toHaveBeenCalled()
  })
})
