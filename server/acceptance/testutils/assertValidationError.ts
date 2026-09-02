import type { Express } from 'express'
import request from 'supertest'
import * as cheerio from 'cheerio'

/**
 * Submits `formData` to `pagePath`, follows the POST-redirect-GET back to
 * the same page, and asserts `expectedMessage` appears in both the error
 * summary and the field-level error message.
 *
 * A real session (`request.agent`) is used so that the flash-based
 * POST-redirect-GET behaves exactly as it does in the browser.
 */
const expectValidationError = async (
  app: Express,
  pagePath: string,
  formData: Record<string, string>,
  expectedMessage: string,
): Promise<void> => {
  const browser = request.agent(app)

  const submission = await browser.post(pagePath).type('form').send(formData)

  expect(submission.status).toBe(302)
  expect(submission.headers.location).toBe(pagePath)

  const redisplayed = await browser.get(pagePath)
  const $ = cheerio.load(redisplayed.text)

  expect($('.govuk-error-summary').text()).toContain(expectedMessage)
  expect($('.govuk-error-message').text()).toContain(expectedMessage)
}

export default expectValidationError

