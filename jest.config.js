module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/"
  ],
  transform: {
    '.+\\.ts': 'ts-jest'
  }
};
