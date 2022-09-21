// process.env.TZ = 'UTC';

module.exports = {
    coverageReporters: [
        "cobertura",
        "html"
    ],
    roots: [
        "<rootDir>"
    ],
    transform: {
        "^.+\\.jsx?$": "babel-jest",
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|/tests/.*(\\.|/)(test|spec))\\.ts$|/src/.*\.test\.ts",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    verbose: true,
    reporters: ["default", "jest-junit"],
    coverageDirectory: ".tmp/coverage",
    transformIgnorePatterns: [
        "<rootDir>/node_modules/(?!libx\.js/.*)"
    ],
}