import { Order, OrderStatusEnum } from '../../models/Order'
import { ValidationError, ValidationResult } from '../../models/Validation'
import Component from '../components/component'

type Page = {
  fields: Array<Component>

  subtitle: string

  title: string
}

export default Page
