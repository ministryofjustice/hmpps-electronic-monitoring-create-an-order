import paths from '../../../constants/paths'
import { Order } from '../../../models/Order'
import { ViewModel } from '../../../models/view-models/utils'
import I18n from '../../../types/i18n'
import { Answer, createAnswer, createDatePreview } from '../../../utils/checkYourAnswers'
import { lookup } from '../../../utils/utils'

type OffenceListSummaryItem = Answer

export type OffenceListComponentModel = ViewModel<unknown> & {
  items: OffenceListSummaryItem[]
  pageHeading: string
  addAnotherQuestion: string
  addAnother: { value: string; error?: { text: string } }
}

const getItems = (order: Order, content: I18n | undefined): Answer[] => {
  const items: Answer[] = []
  const orderId = order.id

  if (order.offences != null && order.offences.length > 0) {
    for (let index = 0; index < order.offences.length; index += 1) {
      const item = order.offences[index]
      items.push(
        createAnswer(
          lookup(content!.reference.offences, item.offenceType),
          `on ${createDatePreview(item.offenceDate!)} `,
          paths.INSTALLATION_AND_RISK.OFFENCE.replace(':orderId', orderId).replace(':offenceId', item.id!),
          {
            deleteUri: paths.INSTALLATION_AND_RISK.DELETE.replace(':orderId', orderId).replace(':offenceId', item.id!),
          },
        ),
      )
    }
  }

  if (order.dapoClauses != null && order.dapoClauses.length > 0) {
    for (let index = 0; index < order.dapoClauses.length; index += 1) {
      const item = order.dapoClauses[index]
      items.push(
        createAnswer(
          item.clause!,
          `on ${createDatePreview(item.date!)} `,
          paths.INSTALLATION_AND_RISK.DAPO_ID.replace(':orderId', orderId).replace(':clauseId', item.id!),
          {
            deleteUri: paths.INSTALLATION_AND_RISK.DELETE.replace(':orderId', orderId).replace(':offenceId', item.id!),
          },
        ),
      )
    }
  }

  return items
}

const constructModel = (order: Order, content: I18n | undefined): OffenceListComponentModel => {
  const pageHeading =
    order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT' ? 'DAPO order clauses' : 'Offences committed'
  const addAnotherQuestion =
    order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT'
      ? 'Are there any other DAPO order clauses?'
      : 'Are there any other offences that the device wearer has committed?'
  const model: OffenceListComponentModel = {
    items: getItems(order, content),
    addAnother: {
      value: '',
    },
    pageHeading,
    addAnotherQuestion,
    errorSummary: null,
  }

  // if (errors && errors.length) {
  //   model.addAnother!.error = getError(errors, 'addAnother')
  //   model.errorSummary = createGovukErrorSummary(errors)
  // }

  return model
}

export default constructModel
