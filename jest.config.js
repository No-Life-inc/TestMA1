export default {
  testEnvironment: 'jest-environment-node',
  transform: {},  // Deaktiver transformering hvis nødvendigt for ESM
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ["dotenv/config"]
};