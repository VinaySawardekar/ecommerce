module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./src/modules/**", "./src/utilities/**"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      lines: 20,
    },
  },

  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.test.js"],
};
