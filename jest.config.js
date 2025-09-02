module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
