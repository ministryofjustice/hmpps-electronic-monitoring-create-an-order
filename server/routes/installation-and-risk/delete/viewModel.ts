import { DapoClause } from '../../../models/DapoClause'
import { Offence } from '../../../models/Offence'
import { Order } from '../../../models/Order'
import { createDatePreview } from '../../../utils/checkYourAnswers'

const construct = (order: Order, id: string) => {
  const matchingOffence = findOffence(order.offences, id)
  const matchingDapoClause = findDapoClause(order.dapoClauses, id)

  let question: string = 'Are you sure that you want to delete this '
  let readableText: string = ''
  if (matchingOffence !== undefined) {
    question += 'offence?'
    readableText = format(matchingOffence.offenceType, matchingOffence.offenceDate)
  } else if (matchingDapoClause) {
    question += 'DAPO order clause?'
    readableText = format(matchingDapoClause.clause, matchingDapoClause.date)
  }
  return {
    question,
    offenceTypeReadable: readableText,
  }
}

const findOffence = (offences: Offence[], id: string) => {
  return offences.find(offence => offence.id === id)
}

const findDapoClause = (dapoClauses: DapoClause[], id: string) => {
  return dapoClauses.find(clause => clause.id === id)
}

const format = (type: string | null, date: string | undefined | null) => {
  return `${type} on ${createDatePreview(date)}`
}

export default { construct }
