import paths from '../../../constants/paths'
import { DapoClause } from '../../../models/DapoClause'
import { Offence } from '../../../models/Offence'
import { Order } from '../../../models/Order'
import { ValidationResult } from '../../../models/Validation'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import DapoClauseListPageConent from '../../../types/i18n/pages/dapoClauseListPage'
import OffenceListPageContent from '../../../types/i18n/pages/offenceListPage'
import { Answer, createAnswer, createDatePreview } from '../../../utils/checkYourAnswers'
import { createGovukErrorSummary } from '../../../utils/errors'
import { getError, lookup } from '../../../utils/utils'

type OffenceListSummaryItem = Answer

export type OffenceListComponentModel = ViewModel<unknown> & {
  items: OffenceListSummaryItem[]
  pageContent: DapoClauseListPageConent | OffenceListPageContent
  addAnother: { value: string; error?: { text: string } }
}

const getItems = (order: Order, content: I18n, isFamilyCourt: boolean): Answer[] => {
  const items: Answer[] = []
  const orderId = order.id
  if (isFamilyCourt) {
    order.dapoClauses?.forEach(item => {
      items.push(getDapoClauseSummaryItem(item, orderId))
    })
  } else {
    order.offences?.forEach(item => {
      items.push(getOffentSummaryItem(item, content, orderId))
    })
  }
  return items
}

const getDapoClauseSummaryItem = (item: DapoClause, orderId: string): Answer =>
  createAnswer(
    item.clause!,
    `on ${createDatePreview(item.date!)} `,
    paths.INSTALLATION_AND_RISK.DAPO_ID.replace(':orderId', orderId).replace(':clauseId', item.id!),
    {
      deleteUri: paths.INSTALLATION_AND_RISK.DELETE.replace(':orderId', orderId).replace(':offenceId', item.id!),
    },
  )

const getOffentSummaryItem = (item: Offence, content: I18n, orderId: string): Answer =>
  createAnswer(
    lookup(content!.reference.offences, item.offenceType),
    `on ${createDatePreview(item.offenceDate!)} `,
    paths.INSTALLATION_AND_RISK.OFFENCE.replace(':orderId', orderId).replace(':offenceId', item.id!),
    {
      deleteUri: paths.INSTALLATION_AND_RISK.DELETE.replace(':orderId', orderId).replace(':offenceId', item.id!),
    },
  )

const constructModel = (order: Order, content: I18n, errors: ValidationResult): OffenceListComponentModel => {
  const isFamilyCourt = order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT'

  const pageContent = isFamilyCourt ? content.pages.dapoClauseList : content?.pages.offenceList

  const model: OffenceListComponentModel = {
    items: getItems(order, content, isFamilyCourt),
    addAnother: {
      value: '',
    },
    pageContent,
    errorSummary: null,
  }

  if (errors && errors.length) {
    model.addAnother!.error = getError(errors, 'addAnother')
    model.errorSummary = createGovukErrorSummary(errors)
  }

  return model
}

export default constructModel
