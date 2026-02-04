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

const getItems = (order: Order, content: I18n | undefined, isFamilyCourt: boolean): Answer[] => {
  const items: Answer[] = []
  const orderId = order.id

  if (isFamilyCourt) {
    order.dapoClauses?.forEach(item => {
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
    })
  } else {
    order.offences?.forEach(item => {
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
    })
  }

  return items
}

const constructModel = (order: Order, content: I18n | undefined): OffenceListComponentModel => {
  const isFamilyCourt = order.interestedParties?.notifyingOrganisation === 'FAMILY_COURT'

  const pageHeading = isFamilyCourt ? 'DAPO order clauses' : 'Offences committed'

  const addAnotherQuestion = isFamilyCourt
    ? 'Are there any other DAPO order clauses?'
    : 'Are there any other offences that the device wearer has committed?'

  const model: OffenceListComponentModel = {
    items: getItems(order, content, isFamilyCourt),
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
