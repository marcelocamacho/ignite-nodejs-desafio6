//const { pathsToModuleNameMapper } = require('ts-jest')
//const { compilerOptions } = require('./tsconfig')
import {pathsToModuleNameMapper} from 'ts-jest';
import {compilerOptions} from './tsconfig.json'
module.exports = {
  testTimeout: 20000,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/modules/**/useCases/**/*.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov"],
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: [
    "**/*.spec.ts"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src" })
};
