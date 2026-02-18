import ServiceRequestTypes from '../../../types/i18n/reference/serviceRequestTypes'

const serviceRequestTypes: ServiceRequestTypes = {
  REINSTALL_DEVICE: {
    text: 'I need monitoring equipment reinstalled',
    description: "The device wearer's primary, secondary or tertiary address has changed.",
  },
  REINSTALL_AT_DIFFERENT_ADDRESS: {
    text: 'I need monitoring equipment installed at an additional address',
    description:
      'The device wearer needs to remain at a second or third address during curfew hours. This is a new address where there was no second or third address previously.',
  },
  REVOCATION: {
    text: 'I need to revoke monitoring for the device wearer',
    description: 'The device wearer has been recalled to prison.',
  },
  END_MONITORING: {
    text: 'I need to end all monitoring for a device wearer',
    description: "The device wearer's circumstances have changed and all monitoring needs to end early.",
  },
  VARIATION: 'I need to change something else in the form',
}

export default serviceRequestTypes
