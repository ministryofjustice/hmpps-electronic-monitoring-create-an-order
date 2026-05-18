import { Order } from '../../models/Order'

const SECTIONS = {
  responsibleOrg: 'ABOUT_THE_RESPONSIBLE_ORGANISATION',
  aboutTheDeviceWearer: 'ABOUT_THE_DEVICE_WEARER',
  riskInformation: 'RISK_INFORMATION',
  electronicMonitoringCondition: 'ELECTRONIC_MONITORING_CONDITIONS',
  additionalDocuments: 'ADDITIONAL_DOCUMENTS',
  variationDetails: 'ABOUT_THE_CHANGES_IN_THIS_VERSION_OF_THE_FORM',
} as const

export type Section = (typeof SECTIONS)[keyof typeof SECTIONS]

export type TaskSection = { name: string }

export default class SectionListService {
  getSections(order: Order): TaskSection[] {
    return [
      { name: SECTIONS.aboutTheDeviceWearer },
      { name: SECTIONS.riskInformation },
      { name: SECTIONS.electronicMonitoringCondition },
      { name: SECTIONS.additionalDocuments },
    ]
  }
}
