/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { initialiseName } from './utils'
import config from '../config'
import logger from '../../logger'

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Hmpps Electronic Monitoring Create An Order'
  app.locals.environmentName = config.environmentName
  app.locals.environmentNameColour = config.environmentName === 'PRE-PRODUCTION' ? 'govuk-tag--green' : ''
  let assetManifest: Record<string, string> = {}

  try {
    const assetMetadataPath = path.resolve(__dirname, '../../assets/manifest.json')
    assetManifest = JSON.parse(fs.readFileSync(assetMetadataPath, 'utf8'))
  } catch (e) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error('Could not read asset manifest file')
    }
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist/',
      'node_modules/@ministryofjustice/frontend/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  function toSentenceCase(key: string) {
    if (typeof key !== 'string') return key

    const lowerCaseKey = key.replace(/([A-Z])/g, ' $1').toLowerCase()

    const sentenceCaseKey = lowerCaseKey.charAt(0).toUpperCase() + lowerCaseKey.slice(1)

    return sentenceCaseKey.trim()
  }

  function checkType(value: unknown): string {
    if (Array.isArray(value)) {
      return 'array'
    }
    if (typeof value === 'object') {
      return 'object'
    }
    if (typeof value === 'string') {
      return 'string'
    }
    return 'other'
  }

  function isEmpty(value: unknown): boolean {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      return true
    }
    return false
  }

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('toSentenceCase', toSentenceCase)
  njkEnv.addFilter('checkType', checkType)
  njkEnv.addFilter('isEmpty', isEmpty)
  njkEnv.addFilter('stringify', (obj: unknown) => JSON.stringify(obj))
}
