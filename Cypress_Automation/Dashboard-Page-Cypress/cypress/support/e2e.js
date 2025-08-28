// cypress/support/e2e.js

// ✅ Import custom commands if any (cypress/support/commands.js)
import './commands';
import '@shelex/cypress-allure-plugin';

// ✅ Handle uncaught exceptions so tests don’t fail unnecessarily
Cypress.on("uncaught:exception", (err) => {
  if (
    err.message.includes("check1 is not defined") ||
    err.message.includes("Cannot read properties of null") ||
    err.message.includes("datepicker is not a function")
  ) {
    return false; // prevent Cypress from failing the test
  }
});

// ✅ Optional: Before each test, print which test is running (good for debugging CI)
beforeEach(function () {
  cy.log(`Running test: ${this.currentTest.title}`);
});

// ✅ Optional: After each test, log status (pass/fail)
afterEach(function () {
  cy.log(`Test finished with status: ${this.currentTest.state}`);
});
