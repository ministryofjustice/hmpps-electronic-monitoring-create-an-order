import { initialiseAppInsights } from './azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

initialiseAppInsights(applicationInfoSupplier())
