/* eslint-disable no-param-reassign */
import path from 'path'
import nunjucks from 'nunjucks'
import express from 'express'
import fs from 'fs'
import { camelCaseToSentenceCase, checkType, initialiseName, isEmpty } from './utils'
import config from '../config'
import logger from '../../logger'
import { variationTypeMap } from '../constants/variation'
import prisons from '../reference/prisons'
import probationRegions from '../reference/probation-regions'
import youthJusticeServiceRegions from '../reference/youth-justice-service-regions'
import crownCourts from '../reference/crown-courts'
import magistratesCourts from '../reference/magistrates-courts'
import questions from '../constants/questions'

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

  njkEnv.addFilter('initialiseName', initialiseName)
  njkEnv.addFilter('assetMap', (url: string) => assetManifest[url] || url)
  njkEnv.addFilter('camelCaseToSentenceCase', camelCaseToSentenceCase)
  njkEnv.addFilter('checkType', checkType)
  njkEnv.addFilter('isEmpty', isEmpty)
  njkEnv.addFilter('stringify', (obj: unknown) => JSON.stringify(obj))
  njkEnv.addFilter('toOptions', (values: Record<string, string>, disabled: boolean) => {
    return Object.keys(values).map(key => ({
      value: key,
      text: values[key],
      disabled,
    }))
  })

  const toOptions = (values: Record<string, string>, disabled: boolean = false) => {
    return [
      { value: '', text: '' },
      ...Object.keys(values).map(key => ({
        value: key,
        text: values[key],
        disabled,
      })),
    ]
  }

  // Add data to global nunjucks env
  njkEnv.addGlobal('questions', questions)
  njkEnv.addGlobal('variationTypes', variationTypeMap)
  njkEnv.addGlobal('prisons', toOptions(prisons))
  njkEnv.addGlobal('probationRegions', toOptions(probationRegions))
  njkEnv.addGlobal('yjsRegions', toOptions(youthJusticeServiceRegions))
  njkEnv.addGlobal('crownCourts', toOptions(crownCourts))
  njkEnv.addGlobal('magistratesCourts', toOptions(magistratesCourts))
}
