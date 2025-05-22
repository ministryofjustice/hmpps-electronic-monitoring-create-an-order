import ReferenceData from './reference'

type SentenceTypes = ReferenceData<
  | 'EXTENDED_DETERMINATE_SENTENCE'
  | 'IPP'
  | 'LIFE_SENTENCE'
  | 'SOPC'
  | 'EPP'
  | 'SECTION_85_EXTENDED_SENTENCES'
  | 'STANDARD_DETERMINATE_SENTENCE'
>

export default SentenceTypes
