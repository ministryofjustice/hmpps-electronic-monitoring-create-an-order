import ServiceRequestTypes from '../../../types/i18n/reference/serviceRequestTypes'

const serviceRequestTypes: ServiceRequestTypes = {
  // SR 11 if civil or immigration else SR21
  REVOCATION: 'The device wearer has been recalled to prison.',
  // SR 11 if civil or immigration else SR21
  END_MONITORING: "The device wearer's circumstances have changed and all monitoring needs to end.",
  // SR 05
  REINSTALL_AT_DIFFERENT_ADDRESS: 'The device wearer needs to remain at a second or third address during curfew hours.',
  // Hard stop options
  NEEDS_CHECKING_OR_REFITTED: 'There is an issue with the equipment and it needs checking or refitted',
  RESPONSIBLE_OFFICER_CHANGED: 'The Responsible Officer has changed',
  // SR 08
  VARIATION: 'I need to change something else in the form',
}

export default serviceRequestTypes
