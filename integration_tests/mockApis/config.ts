function get<T>(name: string, fallback: T): T | string {
  if (process.env[name]) {
    return process.env[name]
  }
  if (fallback !== undefined) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

export default {
  verify_fms_requests: get('VERIFY_FMS_REQUESTS', 'true') === 'true',
}
