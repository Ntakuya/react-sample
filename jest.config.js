module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.jest.json"
    },
    NODE_ENV: "test"
  },
  setupFilesAfterEnv: ["./setuptest.js"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  verbose: true,
  testPathIgnorePatterns: ["node_modules/", "cypress/"]
};
