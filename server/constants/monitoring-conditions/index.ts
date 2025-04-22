const orderTypeMap: Record<string, string> = {
  CIVIL: 'Civil',
  COMMUNITY: 'Community',
  IMMIGRATION: 'Immigration',
  POST_RELEASE: 'Post Release',
  PRE_TRIAL: 'Pre-Trial',
  SPECIAL: 'Special',
}

const orderTypeDescriptionMap: Record<string, string> = {
  DAPO: 'DAPO',
  DAPOL: 'DAPOL',
  DAPOL_HDC: 'DAPOL HDC',
  GPS_ACQUISITIVE_CRIME_HDC: 'GPS Acquisitive Crime HDC',
  GPS_ACQUISITIVE_CRIME_PAROLE: 'GPS Acquisitive Crime Parole',
}

export { orderTypeMap, orderTypeDescriptionMap }
