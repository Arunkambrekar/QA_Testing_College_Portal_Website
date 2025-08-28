// cypress.config.js
const { defineConfig } = require("cypress");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://parents.kletech.ac.in",
    chromeWebSecurity: false,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    video: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // ✅ Allure plugin writer
      allureWriter(on, config);

      // ✅ Screenshots for mochawesome
      require("cypress-mochawesome-reporter/plugin")(on);

      return config;
    },
  },

  env: {
    allure: true,
    allureResultsPath: "allure-results",
    CYPRESS_NO_IPV6: true,
  },

  // ✅ Multi reporter setup
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
    cypressMochawesomeReporterReporterOptions: {
      reportDir: "cypress/reports/mochawesome",
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: "cypress/reports/junit/results-[hash].xml",
      toConsole: false,
    },
  },
});
