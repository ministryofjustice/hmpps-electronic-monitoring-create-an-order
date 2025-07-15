/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { camelCaseToSentenceCase, checkType, initialiseName, isEmpty } from './utils'
import config from '../config'
import logger from '../../logger'
import ReferenceData from '../types/i18n/reference/reference'
import { CheckboxItem } from './govukFrontEndTypes/checkBoxItem'
import { RadiosItem } from './govukFrontEndTypes/radioItem'

const toOptions = (
  values: ReferenceData,
  disabled: boolean = false,
  includeEmptyOption: boolean = false,
  type: string = '',
): Array<CheckboxItem | RadiosItem> => {
  const options = Object.keys(values).map(key => {
    if (typeof values[key] === 'object') {
      return {
        value: key,
        text: values[key].text,
        hint: {
          text: values[key].description,
        },
        disabled,
      }
    }

    return {
      value: key,
      text: values[key],
      disabled,
    }
  })

  if (includeEmptyOption) {
    if (type === 'Radio') options.push({ value: '', text: 'Not able to provide this information', disabled })
    else options.unshift({ value: '', text: 'Select', disabled })
  }

  return options
}

const addDivider = (items: Array<CheckboxItem>, dividerText: string = 'or'): Array<CheckboxItem | RadiosItem> => {
  const lenght = items.length
  return [
    ...items.slice(0, lenght - 1),
    {
      value: '',
      divider: dividerText,
    },
    ...items.slice(lenght - 1),
  ]
}

export default function nunjucksSetup(app: express.Express): void {
  app.set('view engine', 'njk')

  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Apply, change or end an Electronic Monitoring Order (EMO)'
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

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('camelCaseToSentenceCase', camelCaseToSentenceCase)
  njkEnv.addFilter('checkType', checkType)
  njkEnv.addFilter('isEmpty', isEmpty)
  njkEnv.addFilter('stringify', (obj: unknown) => JSON.stringify(obj))
  njkEnv.addFilter('toOptions', toOptions)
  njkEnv.addFilter('addDivider', addDivider)
}
