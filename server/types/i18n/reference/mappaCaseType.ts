import ReferenceData from './reference'

type MappaCaseType = ReferenceData<
  | 'SOC (Serious Organised Crime)'
  | 'CPPC (Critical Public Protection case)'
  | 'TACT (Terrorism Act, Counter Terrorism)'
  | 'TPIM (Terrorism Prevention and Investigation measures)'
  | 'SIAC  (Special Immigration Appeals Commission)'
  | 'High Profile Immigration'
>

export default MappaCaseType
