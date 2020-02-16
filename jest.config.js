module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  testEnvironment: 'jest-environment-jsdom-fourteen',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/examples/',
    'dist/',
    '(.test)\\.(ts|tsx|js)$',
    'jest.transform.js',
    '.json',
  ],
  modulePathIgnorePatterns: ['dist/', 'lib/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.ts',
  },
};
