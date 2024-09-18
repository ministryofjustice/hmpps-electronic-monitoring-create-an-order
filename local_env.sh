SECRETS=$(kubectl get secret hmpps-electronic-monitoring-create-an-order -n hmpps-ems-cemo-ui-dev -o json)

export API_CLIENT_ID=$(jq -r '.data.API_CLIENT_ID' <<< "${SECRETS}" | base64 -d)
export API_CLIENT_SECRET=$(jq -r '.data.API_CLIENT_SECRET' <<< "${SECRETS}" | base64 -d)
export SYSTEM_CLIENT_ID=$(jq -r '.data.SYSTEM_CLIENT_ID' <<< "${SECRETS}" | base64 -d)
export SYSTEM_CLIENT_SECRET=$(jq -r '.data.SYSTEM_CLIENT_SECRET' <<< "${SECRETS}" | base64 -d)
export HMPPS_AUTH_EXTERNAL_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
export HMPPS_AUTH_URL=https://sign-in-dev.hmpps.service.justice.gov.uk/auth
export TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
