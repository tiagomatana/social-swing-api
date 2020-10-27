const {pathsToModuleNameMapper} = require("ts-jest/utils");
const {compilerOptions} = require("./tsconfig");

module.exports = {
    preset: 'ts-jest',
    clearMocks: true,
    testEnvironment: 'node',
    collectCoverage: false,
    lib: ['@shelf/jest-mongodb'],
    collectCoverageFrom: [
        "./src/**/*.ts"
    ],
    // The directory where Jest should output its coverage files
    coverageDirectory: "./.coverage",
    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "src/__test__"
    ],
    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: [
        "html",
        "text",
        "json"
    ],
    testMatch: [
        "**/*.test.ts",
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>",
    })
};
