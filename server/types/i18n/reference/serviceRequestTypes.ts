import ReferenceData from './reference'

type ServiceRequestTypes = ReferenceData<
  | 'REINSTALL_AT_DIFFERENT_ADDRESS'
  | 'REVOCATION'
  | 'VARIATION'
  | 'END_MONITORING'
  | 'NEEDS_CHECKING_OR_REFITTED'
  | 'RESPONSIBLE_OFFICER_CHANGED'
>

export default ServiceRequestTypes
