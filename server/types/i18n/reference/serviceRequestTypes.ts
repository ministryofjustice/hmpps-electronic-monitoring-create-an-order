import ReferenceData from './reference'

type ServiceRequestTypes = ReferenceData<
  'REINSTALL_AT_DIFFERENT_ADDRESS' | 'REINSTALL_DEVICE' | 'REVOCATION' | 'MAKING_A_CHANGE'
>

export default ServiceRequestTypes
