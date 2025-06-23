import ReferenceData from './reference'

type PossibleRisks = ReferenceData<
  'THREATS_OF_VIOLENCE' | 'SEXUAL_OFFENCES' | 'RISK_TO_GENDER' | 'RACIAL_ABUSE_OR_THREATS' | 'NO_RISK'
>
export default PossibleRisks
