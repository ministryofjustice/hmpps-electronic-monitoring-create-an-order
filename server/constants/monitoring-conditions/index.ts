const conditionTypeMap: Record<string, string> = {
  REQUIREMENT_OF_A_COMMUNITY_ORDER: 'Requirement of a Community Order',
  LICENSE_CONDITION_OF_A_CUSTODIAL_ORDER: 'License Condition of a Custodial Order',
  POST_SENTENCE_SUPERVISION_REQUIREMENT:
    'Post-Sentence Supervision Requirement following on from an Adult Custody order',
  BAIL_ORDER: 'Bail Order',
}

const orderTypeMap: Record<string, string> = {
  civil: 'Civil',
  community: 'Community',
  immigration: 'Immigration',
  post_release: 'Post Release',
  pre_trial: 'Pre-Trial',
  special: 'Special',
}

const orderTypeDescriptionMap: Record<string, string> = {
  DAPO: 'DAPO',
  DAPOL: 'DAPOL',
  DAPOL_HDC: 'DAPOL HDC',
  GPS_ACQUISITIVE_CRIME_HDC: 'GPS Acquisitive Crime HDC',
  GPS_ACQUISITIVE_CRIME_PAROLE: 'GPS Acquisitive Crime Parole',
}

export { conditionTypeMap, orderTypeMap, orderTypeDescriptionMap }