const readSimulationConfig = (environment: Record<string, string | undefined>) => {
  const enabled = environment.UP3_SIMULATION_UI_ENABLED === 'true'
  if (enabled && !['LOCAL', 'DEV'].includes(environment.ENVIRONMENT_NAME ?? '')) {
    throw new Error('UP3 simulation UI requires ENVIRONMENT_NAME=LOCAL or DEV')
  }
  return { enabled }
}

export default readSimulationConfig
