import { createDefaultEsmPreset } from 'ts-jest'

const presetConfig = createDefaultEsmPreset({
  tsconfig: 'tsconfig.json'
})

export default {
  ...presetConfig,
  testEnvironment: 'node',
  injectGlobals: true,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts']
}