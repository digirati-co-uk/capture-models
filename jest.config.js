module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  cacheDirectory: '.jest-cache',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/examples/',
    'dist/',
    'lib/',
    '(.test)\\.(ts|tsx|js)$',
    'jest.transform.js',
    '.json',
  ],
  maxConcurrency: 4,
  modulePathIgnorePatterns: ['dist/', 'lib/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.ts',
    '@capture-models/helpers': '<rootDir>/packages/helpers/src/index.ts',
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
      babelConfig: {
        plugins: ['macros'],
      },
    },
  },
};
