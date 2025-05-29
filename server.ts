// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'

import fs from 'fs'
import path from 'path'
import app from './server/index'
import logger from './logger'

// Create feature flag directories
const featureFlagDir = path.join(process.cwd(), 'data')
const flagFilePath = path.join(featureFlagDir, 'feature-flags.json')
const defaultFlagFilePath = path.join(featureFlagDir, 'default-feature-flags.json')

if (!fs.existsSync(featureFlagDir)) {
  fs.mkdirSync(featureFlagDir)
}

if (!fs.existsSync(flagFilePath)) {
  fs.writeFileSync(flagFilePath, '{}', 'utf-8')
}

if (!fs.existsSync(defaultFlagFilePath)) {
  fs.writeFileSync(defaultFlagFilePath, '{}', 'utf-8')
}

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})
