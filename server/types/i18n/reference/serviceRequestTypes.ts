import ReferenceData from './reference'

type ServiceRequestTypes = ReferenceData<
  'REINSTALL_AT_DIFFERENT_ADDRESS' | 'REINSTALL_DEVICE' | 'REVOCATION' | 'VARIATION' | 'END_MONITORING'
>

export default ServiceRequestTypes
